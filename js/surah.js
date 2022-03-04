let ayahAudio =[];

//Full play
document.getElementById('fullplaydiv').innerHTML = `
	<button class="btn btn-success me-3">Play Full</button>
	<button class="btn btn-success px-4">Stop</button>
`
// Get Parameter from link
const {search} = window.location;
const numberOfSurah = (new URLSearchParams(search)).get('surah');


fetch(`https://api.quran.sutanlab.id/surah/${numberOfSurah}`)
.then(response => response.json())
.then(data => displaySurah(data.data, numberOfSurah));

const displaySurah = (data, numberOfSurah) => {
	document.getElementById('surah-name').innerText = data.name.transliteration.en;
	document.getElementById('ayah-total').innerText = `Ayah ${data.verses.length}`;
	const container = document.getElementById('surah');

	

	data.verses.forEach((d, index) => {
		// const div = document.createElement('div');
		// div.innerHTML = `
			
		// `;
		let str = d.text.transliteration.en;
		// let str = trns.split(" ");
		// str = str.reverse();
		// str = str.join(' ');
		container.innerHTML += `
		<div class='text-center fw-bold border border-2 ayah p-3 rounded my-2'>
			<div class="fs-3"> ${d.text.arab} (${index+1}) </div> 
			<div class='d-block fw-normal pt-2 ayah-translations'>
				${str}
			</div>	
			<div>
				<button id="stopping-${index}" class="btn  btn-success mt-3 px-4" onclick="loadAudioOfSurah(${index},${numberOfSurah},false)">Stop</button>
				<button id="playing-${index}" class="btn  btn-success mt-3 me-2 px-4" onclick="loadAudioOfSurah(${index},${numberOfSurah},true)">Play</button>
			</div>
		</div>
		
		`;

	})
	//Full play
	document.getElementById('fullplaydiv').innerHTML = `
		<button id="fullplaybutton" class="btn btn-success me-3" onclick=loadFullPlay(${numberOfSurah})>Play Full</button>
		<button id="fullstopbutton" class="btn btn-success px-4" onclick="stopFullPlay()">Stop</button>
		`;
}

const loadAudioOfSurah = (index,numberOfSurah, condition) => {
	const url = `https://api.quran.sutanlab.id/surah/${numberOfSurah}`;

	fetch(url)
	.then(res => res.json())
	.then(data => playAudioOfSurah(data.data, condition, index));
}

const playAudioOfSurah = (data, condition , index) => {
	const audio = document.getElementById('audioPlay');
	audio.pause();

	const fullplaybutton = document.getElementById('fullplaybutton');
	fullplaybutton.innerText = 'Play Full';
	fullplaybutton.classList.remove('btn-danger');
	const len = data.verses.length;
	for(let i=0; i<len; i++){
		const playbutton = document.getElementById(`playing-${i}`);
		playbutton.innerText = 'Play';
		playbutton.classList.remove('btn-danger');
	}
	data = data.verses[index];

	
	audio.setAttribute('src', data.audio.primary);
	// console.log(index);
	audio.setAttribute('onended', `playingEnded('playing-${index}')`)
	if(condition === true){
		const playing = document.getElementById(`playing-${index}`);
		playing.innerText = 'Running';
		playing.classList.add('btn-danger');
		audio.play();
		
	} else{

		playingEnded(`playing-${index}`);
		audio.pause();
	}
}

const playingEnded = (id) => {
	// alert(id);
	const audio = document.getElementById('audioPlay');
	audio.removeAttribute('onended');
	audio.pause();
	const playing = document.getElementById(id);
	playing.innerText = 'Play';
	playing.classList.remove('btn-danger');
	ayahAudio = [];
}

const loadFullPlay = (numberOfSurah) => {
	const url = `https://api.quran.sutanlab.id/surah/${numberOfSurah}`;

	fetch(url)
	.then(res => res.json())
	.then(data => playFullPlay(data.data.verses, numberOfSurah));
}


const playFullPlay = (data , numberOfSurah) => {
		const fullplaybutton = document.getElementById('fullplaybutton');
		fullplaybutton.innerText = 'Play Full Running';
		fullplaybutton.classList.add('btn-danger');
		let len = data.length;
		for(let i=0; i<len; i++){
			const playbutton = document.getElementById(`playing-${i}`);
			playbutton.innerText = 'Play';
			playbutton.classList.remove('btn-danger');
		}
		data.forEach(d => {
			ayahAudio.push(d.audio.primary);
		})
		// console.log(ayahAudio);
		const audio = document.getElementById('audioPlay');
		let inx=0;
		console.log
		playAyah(inx);
		
		audio.addEventListener('ended', ()=>{
			inx++;
			console.log(inx);
			if(inx<len){
				playAyah(inx);
			} else{
				const fullplaybutton = document.getElementById('fullplaybutton');
				fullplaybutton.innerText = 'Play Full';
				fullplaybutton.classList.remove('btn-danger');
				audio.pause();
				audio.src = '';
				// inx=0;
			}
		} )
}
const playAyah = (index) => {
		
		const audio = document.getElementById('audioPlay');
		
		audio.pause();
		console.log(index);
		if(index!==1000){
			audio.src = ayahAudio[index];
			audio.play();
		
		}
		
}

const stopFullPlay = () => {
	const fullplaybutton = document.getElementById('fullplaybutton');
	fullplaybutton.innerText = 'Play Full';
	fullplaybutton.classList.remove('btn-danger');

	ayahAudio =[];
	const audio = document.getElementById('audioPlay');	
	audio.pause();
}