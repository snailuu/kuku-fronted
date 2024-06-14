import '@/style/loading.scss';

/**
 * 页面全局 Loading
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 创建 loading
	start: () => {
		const el = <HTMLElement>document.querySelector('.loading-next');
		if(el)return;
		const bodys: Element = document.body;
		const div = <HTMLElement>document.createElement('div');
		// div.setAttribute('class', 'loading-next');
		div.setAttribute('class', 'loading-box');
		// const htmls = `
		// 	<div class="loading-next-box">
		// 		<div class="loading-next-box-warp">
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 			<div class="loading-next-box-item"></div>
		// 		</div>
		// 	</div>
		// `;
		const htmls = `
			<svg>
            <filter id="fluid">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10"></feGaussianBlur>
                <feColorMatrix values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 20 -10 ">
                </feColorMatrix>
            </filter>
        </svg>
        <div class="loader">
            <span style="--i:1"></span>
            <span style="--i:2"></span>
            <span style="--i:3"></span>
            <span style="--i:4"></span>
            <span style="--i:5"></span>
            <span style="--i:6"></span>
            <span style="--i:7"></span>
            <span style="--i:8"></span>
            <span class="rotate" style="--j:0"></span>
            <span class="rotate" style="--j:1"></span>
            <span class="rotate" style="--j:2"></span>
            <span class="rotate" style="--j:3"></span>
            <span class="rotate" style="--j:4"></span>
        </div>
        <div class="word">加载中</div>`;
		div.innerHTML = htmls;
		bodys.insertBefore(div, bodys.childNodes[0]);
		window.nextLoading = true;
	},
	// 移除 loading
	done: (time: number = 0) => {
		nextTick(() => {
			setTimeout(() => {
				window.nextLoading = false;
				const el = <HTMLElement>document.querySelector('.loading-box');
				el?.parentNode?.removeChild(el);
			}, time);
		});
	},
};
