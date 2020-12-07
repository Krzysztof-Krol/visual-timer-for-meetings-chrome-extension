
// Set default time
var time = 20;
var timeout;

// Update time on change
var popupInput = document.getElementsByTagName("input")[0];
popupInput.addEventListener("change", function(){
	time = this.value;
	timeout = time*60*1000;
});

if (popupInput.value == '') {
	time = 20;
	timeout = time*60*1000;
}

// Browser Tables Injection
function injection(){
	var parameters = {text: time, foo: 1, bar: false, };
	chrome.tabs.executeScript({
		code: '(' + function(params) {
			// Remove previous bar if exist
			var bar = document.getElementsByClassName("countdownBar")[0];
			if(bar){
				bar.remove();
			}

			// Declare animation time
			var duration = params.text * 60;

			// Render countdown bar
			document.head.insertAdjacentHTML('beforeend',
				'<style>@keyframes fillInFromLeft {0% { width: 0%; } 100% { width: 100%; } }</style>'
			);

			// Render countdown bar
			document.body.insertAdjacentHTML('beforeend',
				'<div class="countdownBar" style="all: unset; display: block; position: fixed; left: 0; right: 0; bottom: 0; height: 1cm;'
				+ 'width: 100%; background-color: transparent; z-index: 9999999;">'
				+ '<div class="fill" style="all: unset; width: 100%; height: 100%; display: block; background: red; '
				+ 'margin-right: auto; margin-left: 0; animation: fillInFromLeft ' + duration + 's linear;"></div></div>'
			);

			var timeout = duration*1000;
			setTimeout(function(){
				document.body.insertAdjacentHTML('beforeend',
					'<div class="overlay" style="all: unset; display: flex; align-items: center; justify-content: center;'
					+ 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; height: 100%; '
					+ 'width: 100%; background-color: rgba(0,0,0,0.7); z-index: 9999999;">'
					+ '<div class="popup" style="all: unset; width: 350px; height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; color: black;'
					+ 'margin: auto; padding: 20px; text-align: center;"><p style="all: unset; font-size: 22px; display: flex; align-items: center; '
					+ 'justify-content: center; margin-bottom: 5px;">Time is over.<br><p style="font-size: 16px; margin-bottom: 10px;">Start again if you need me.</p></p>'
					+ '<div style="display: flex; width: 100%; justify-content: center;">'
					+ '<button style="border: 0; padding: 5px 10px; box-shadow: 0 2px 4px darkgray; margin-right: 10px; background: gray; color: white;" '
					+ 'onClick="document.getElementsByClassName(\'overlay\')[0].remove()">OK</button>'
					+ '</div>'
					+ '</div></div>'
				);
			}, timeout);

			// Declare rendered objects
			var countdownBar = document.getElementsByClassName("countdownBar")[0];
			var fill = countdownBar.children[0];

			return {success: true, html: document.body.innerHTML, duration};
		} + ')(' + JSON.stringify(parameters) + ');'
	});

	setTimeout(function(){
		var audio = new Audio('sound.mp4');
		audio.play();
	}, timeout);
}

// Run countdown bar
var start = document.getElementsByTagName("button")[0];
start.addEventListener("click", injection);