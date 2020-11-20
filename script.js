// ==UserScript==
// @name         Bot for Yandex
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  try to take over the world!
// @author       Arseny
// @match        https://yandex.ru/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @match        https://crushdrummers.ru/*
// @grant        none
// ==/UserScript==

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

let sites = {
	'xn----7sbab5aqcbiddtdj1e1g.xn--p1ai': [
		'Гобой',
		'Саксофон',
		'Валторна',
		'Фагот',
		'Флейта',
		'Как звучит флейта',
		'Скрипка'
	],
	'crushdrummers.ru': [ 'Барабанное шоу', 'Шоу барабанщиков москва', 'Заказать барабанное шоу' ]
};
let site = Object.keys(sites)[getRandom(0, Object.keys(sites).length)];
let keywords = sites[site];
let keyword = keywords[getRandom(0, keywords.length)];
let yandexInput = document.getElementById('text');
let button = document.getElementsByClassName('button_theme_websearch')[0];
//let links = document.links;
//let links = document.getElementsByClassName('link link_theme_normal organic__url');
//let links = document.getElementsByClassName("link link_theme_normal organic__url organic__url_type_multiline i-bem link_js_inited");
if (yandexInput != null) {
	// после первого нажатия на кнопку "Найти" = null
	if (button != undefined) {
		// после первого нажатия на кнопку "Найти" = undefined
		let i = 0; // первая буква искомого слова
		//document.cookie = "site"+site;
		document.cookie = 'site=' + site; // Устанавливаем в cookie имя искоиого сайта
		let timerId = setInterval(() => { // Устанавлмиваем таймер для интервала в пол секунды
			let yandexInputs = document.getElementsByClassName('input__control mini-suggest__input')[0]; // берем в переменную поле для поиска
			yandexInputs.value += keyword[i++]; // вводим по буквенно искомое слово с интервалом в пол секкунды в поле для поиска
			if (i == keyword.length) { // Если конец искомого слова то
				clearInterval(timerId); // сбрасываем таймер длч интервала
				button.click(); // Кликаем по кнопке "поиск"
			}
		}, 500); // пол секунды
	}
} else if (location.hostname == 'yandex.ru') { // Проверяем location.hostname если она равна yandex.ru, то
	let flag = true; // переменная flag = true
	//let numPage = document.getElementsByClassName("link link_theme_none link_target_serp pager__item pager__item_kind_page i-bem link_js_inited")[0].innerText;

	site = getCookie('site'); // берем из Cookie имя сайта
	let links = document.getElementsByClassName("link link_theme_normal organic__url"); // Все ссылки со страницы
	// ==== цикл поиска необходимый ссылки ========
	for (let i = 0; i < links.length; i++) { // Перебираем в цикле все ссылки на странице
		let link = links[i];
		if (link.href.indexOf(site) != -1) { // Если ссылка имеет искомый адрес сайта то
			flag = false; // переменная flag = false
			link.removeAttribute('target'); // удаляем атрибут target, чтобы открыть сайт в этом же окне
			setTimeout(() => link.href.click(), 2000); // делаем задержку на клик в 2 секунды
			break; // вываливаемся из цикла
		} //else {
			//let nextPage = document.querySelector(`a[aria-label="Следующая страница"]`);
			//nextPage.click();
    //}
	}
  // =========== конец цикла ======================
  let nextPage = document.querySelector(`a[aria-label="Следующая страница"]`); // присваеваем nextPage кнопку "Следующая страница"
			nextPage.click(); // кликаем по кнопке "Следующая страница"
    let numPage = document.getElementsByClassName( // вычисляем номер поисковой страницы
		'link link_theme_none link_target_serp pager__item pager__item_kind_page i-bem')[0].textContent;

	if (numPage == '10') location.href = 'https://yandex.ru'; // если достигли 10-ой страницы возвращаемся на yandex.ru
       let link = document.links; // берем все ссылки со страницы искоиого сайта
       if (flag) setTimeout(() => link.href.click(), 2000); // Если flag = true Делаем задержку в 2 секунды
} else { // иначе
	if (getRandom(0, 100) >= 80)
		location.href = 'https://yandex.ru'; // с 20% долей вероятности возврщаемся на страницу yandex.ru
	else
		setInterval(() => { // Устанавливаем интервал в пол секунды
			let link = links[getRandom(0, links.length)]; // Берем случайную ссылку со страницы искоиого сайта
			if (link.href.indexOf(location.hostname) != -1) link.click(); // Если она локальная, то кликаем по ней
		}, 500);
}
