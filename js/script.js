const loadAllPara = () => {
	fetch('https://api.quran.sutanlab.id/surah')
		.then(response => response.json())
		.then(data => displayAllPara(data.data));
};
loadAllPara();

const displayAllPara = (data) => {
	const container = document.getElementById('ParaDetails');
	data.forEach(d => {
		const div = document.createElement('div');
		div.classList.add('para-card');
		div.classList.add('col-lg-3');
		div.onclick = () => {
			const url = `../surah.html?surah=${d.number}`;
			window.location.href = url;
		}
		div.innerHTML = `
		<h3 class='d-flex align-items-center fs-5 fw-bold'><div class='para-number-card d-flex align-items-center justify-content-center'><div class='para-number'>${d.number}</div></div> ${d.name.transliteration.en}</h3>
		<div>
			<h3 class='fs-5 text-center'>${d.name.short}</h3>
			<h4 class='fs-6 text-center'>Ayahs ${d.numberOfVerses}</h4>
		</div>
		`;
		container.appendChild(div);
	})
}
