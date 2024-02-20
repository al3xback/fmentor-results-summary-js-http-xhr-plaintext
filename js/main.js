import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/8a93bf75890f093521fd38fa2ac609c1/raw/2c657c0d12200d250212176bb1b6ca5613e190ee/results-summary-data.txt';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardCategoryTemplate = document.getElementById('card-category-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const rawData = data.split('\n');

	const cardData = [];
	let cardItemData = [];
	for (let i = 0; i < rawData.length; i++) {
		const item = rawData[i];
		if (item === '') {
			cardData.push(cardItemData);
			cardItemData = [];
			continue;
		}
		cardItemData.push(item);
		if (i === rawData.length - 1) {
			cardData.push(cardItemData);
		}
	}

	const [resultData, summaryData] = cardData;
	const [resultTitle, resultChart, resultDescTitle, resultDescContent] =
		resultData;
	const [summaryTitle, ...summaryCategories] = summaryData;

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');
	const cardResultEl = cardEl.querySelector('.card__result');
	const cardSummaryEl = cardEl.querySelector('.card__summary');

	/* card result */
	const cardResultTitleEl = cardResultEl.querySelector('.card__title');
	cardResultTitleEl.textContent = resultTitle;

	const cardResultChartScoreEl =
		cardResultEl.querySelector('.card__chart-score');
	cardResultChartScoreEl.textContent = resultChart.substring(
		0,
		resultChart.indexOf(' ')
	);

	const cardResultChartMaxScoreEl = cardResultEl.querySelector(
		'.card__chart-score + span'
	);
	cardResultChartMaxScoreEl.textContent = resultChart.substring(
		resultChart.indexOf(' ') + 1
	);

	const cardResultDescTitleEl = cardEl.querySelector('.card__desc-title');
	cardResultDescTitleEl.textContent = resultDescTitle;

	const cardResultDescContentEl = cardEl.querySelector('.card__desc-content');
	cardResultDescContentEl.textContent = resultDescContent;

	/* card summary */
	const cardSummaryTitleEl = cardSummaryEl.querySelector('.card__title');
	cardSummaryTitleEl.textContent = summaryTitle;

	const cardSummaryCategoriesEl =
		cardSummaryEl.querySelector('.card__data-list');

	for (const category of summaryCategories) {
		const [name, score] = category.split(': ');

		const cardCategoryTemplateNode = document.importNode(
			cardCategoryTemplate.content,
			true
		);
		const cardCategoryEl =
			cardCategoryTemplateNode.querySelector('.card__data-item');
		cardCategoryEl.classList.add('card__data-item--' + name.toLowerCase());

		const cardCategoryImageEl =
			cardCategoryEl.querySelector('.card__data-img');
		cardCategoryImageEl.src =
			'./images/icons/' + name.toLowerCase() + '.svg';
		cardCategoryImageEl.alt = '';

		const cardCategoryTitleEl =
			cardCategoryEl.querySelector('.card__data-title');
		cardCategoryTitleEl.textContent = name;

		const cardCategoryScoreEl = cardCategoryEl.querySelector(
			'.card__data-score span:first-child'
		);
		cardCategoryScoreEl.textContent = score;

		cardSummaryCategoriesEl.appendChild(cardCategoryTemplateNode);
	}

	removeLoading();
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
