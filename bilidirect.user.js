// ==UserScript==
// @name         BiliDirect · B站直链复制
// @namespace    https://bili.shany.cc/
// @version      1.0.0
// @description  在 B 站视频页一键复制视频直链，本地解析，不经过任何服务器
// @author       ShanyJin & Navi(Claude)
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const btn = document.createElement('div');
    btn.textContent = '复制直链';
    Object.assign(btn.style, {
        position: 'fixed',
        right: '16px',
        bottom: '96px',
        zIndex: '99999',
        padding: '10px 16px',
        borderRadius: '8px',
        background: '#00a1d6',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,0,0,.3)',
        userSelect: 'none',
        webkitUserSelect: 'none'
    });
    btn.addEventListener('mouseenter', () => { btn.style.background = '#00b0e8'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = '#00a1d6'; });
    document.body.appendChild(btn);

    const tip = document.createElement('div');
    Object.assign(tip.style, {
        position: 'fixed',
        left: '50%',
        bottom: '150px',
        transform: 'translateX(-50%)',
        zIndex: '99999',
        padding: '9px 16px',
        borderRadius: '8px',
        background: '#101215',
        color: '#e6e9ed',
        fontSize: '13px',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity .2s ease'
    });
    document.body.appendChild(tip);
    let tipTimer;
    function toast(msg) {
        tip.textContent = msg;
        tip.style.opacity = '1';
        clearTimeout(tipTimer);
        tipTimer = setTimeout(() => { tip.style.opacity = '0'; }, 2200);
    }

    async function copy(t) {
        try { await navigator.clipboard.writeText(t); return 1; } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = t;
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            ta.remove();
            return ok;
        }
    }

    btn.addEventListener('click', async () => {
        try {
            const m = location.pathname.match(/\/video\/(BV[0-9A-Za-z]{10})/);
            const u = new URL(location.href);
            const bv = (m && m[1]) || u.searchParams.get('bvid');
            if (!bv) return toast('请在 B 站视频播放页使用');
            const p = +(u.searchParams.get('p') || 1);
            const get = async x => (await fetch(x, { credentials: 'include' })).json();
            const v = await get('https://api.bilibili.com/x/web-interface/view?bvid=' + bv);
            if (v.code !== 0) return toast('取视频信息失败：' + (v.message || v.code));
            const pg = (v.data.pages || []).find(x => x.page === p) || { cid: v.data.cid };
            const d = await get('https://api.bilibili.com/x/player/playurl?bvid=' + bv + '&cid=' + pg.cid + '&qn=80&fnval=1&platform=html5&high_quality=1');
            if (d.code !== 0) return toast('解析失败：' + (d.message || d.code));
            const url = (d.data.durl && d.data.durl[0] && d.data.durl[0].url) || '';
            if (!url) return toast('没拿到直链，可能需要登录或是番剧');
            if (await copy(url)) toast('已复制直链');
            else prompt('已解析，请手动复制：', url);
        } catch (e) {
            toast('出错了：' + e.message);
        }
    });
})();