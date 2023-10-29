// Подключение из node_modules
import * as noUiSlider from 'nouislider';

// Подключение стилей из scss/base/forms/range.scss 
// в файле scss/forms/forms.scss

// Подключение cтилей из node_modules
// import 'nouislider/dist/nouislider.css';

export function rangeInit() {
	const rangeItems=document.querySelectorAll('[data-range]');
	if(rangeItems.length){
		rangeItems.forEach(rangeItem => {
			const fromValue = rangeItem.querySelector('[data-range-from]')
			const toValue = rangeItem.querySelector('[data-range-to]')
			const item = rangeItem.querySelector('[data-range-item]')
			noUiSlider.create(item, {
				start: [fromValue.value,toValue.value],
				connect: true,
				tooltips:[true,true],
				range: {
					'min':Number(fromValue.dataset.rangeFrom),
					'max':Number(toValue.dataset.rangeTo)
				}

			});
			item.noUiSlider.on('update', function (values, handle) {
				const allValue=[fromValue,toValue]
				allValue[handle].value = values[handle];
				
			});
		})
	}
}
rangeInit();
