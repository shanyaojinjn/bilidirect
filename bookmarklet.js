(async()=>{
    const m=location.pathname.match(/\/video\/(BV[0-9A-Za-z]{10})/),u=new URL(location.href),bv=(m&&m[1])||u.searchParams.get('bvid');
    if(!bv)return alert('请在 B 站视频播放页使用');
    const p=+(u.searchParams.get('p')||1),get=async x=>(await fetch(x,{credentials:'include'})).json(),v=await get('https://api.bilibili.com/x/web-interface/view?bvid='+bv);
    if(v.code!==0)return alert('取视频信息失败：'+(v.message||v.code));
    const pg=(v.data.pages||[]).find(x=>x.page===p)||{cid:v.data.cid},d=await get('https://api.bilibili.com/x/player/playurl?bvid='+bv+'&cid='+pg.cid+'&qn=80&fnval=1&platform=html5&high_quality=1');
    if(d.code!==0)return alert('解析失败：'+(d.message||d.code));
    const url=(d.data.durl&&d.data.durl[0]&&d.data.durl[0].url)||'';
    if(!url)return alert('没拿到直链，可能需要登录或是番剧');
    const q={16:'360P',32:'480P',64:'720P',80:'1080P',112:'1080P+',116:'1080P60',120:'4K'}[d.data.quality]||d.data.quality,copy=async t=>{
        try{
            await navigator.clipboard.writeText(t);
            return 1
        }catch(e){
            const ta=document.createElement('textarea');
            ta.value=t;
            document.body.appendChild(ta);
            ta.select();
            const ok=document.execCommand('copy');
            ta.remove();
            return ok
        }
    };
    if(await copy(url))alert('已复制 '+q+' 直链：'+url);
    else prompt('已解析 '+q+'，请手动复制：',url)
})()
