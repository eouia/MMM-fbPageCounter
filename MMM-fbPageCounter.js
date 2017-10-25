Module.register("MMM-fbPageCounter",{

	// Module config defaults.
	defaults: {
		access_token: "",
		page_id: "",
		refresh_interval_sec: 10, //minimum 10. If your daily visitors of page are under 10, use 30 as this value.
		size: "default"
	},

	getStyles: function() {
		return ["MMM-fbPageCounter.css", "flipcounter.css"]
	},

	getScripts: function() {
		return [
			this.file("js/flipcounter.js")
		]
	},

	start: function() {
		this.fb = {}
		this.myCounter = null
		this.apiUrl = "https://graph.facebook.com/v2.10/"
			+ this.config.page_id
			+ "/?fields=fan_count,name&access_token="
			+ this.config.access_token

		if (this.config.refresh_interval_sec < 10) {
			this.config.refresh_interval_sec = 10
		}
	},

	getDom: function() {
		var wrapper = document.createElement("div")
		wrapper.className = "fb_board"
		var myCounter = document.createElement("ul")
		myCounter.className = "flip-counter " + this.config.size
		myCounter.id = "myCounter_" + this.data.identifier
		wrapper.appendChild(myCounter)

		return wrapper
	},


	notificationReceived:function(noti, payload, sender) {
		if (noti == "DOM_OBJECTS_CREATED") {
			this.myCounter = new flipCounter("myCounter_" + this.data.identifier, {value: 0, pace:100, auto: false})
			this.updateCounter()
			var self = this
			setInterval(function() {
				self.updateCounter()
			}, this.config.refresh_interval_sec * 1000)
		}
	},

	updateCounter: function() {
		var self = this
		this.loadJSON(this.apiUrl,
			function (result) {
				self.fb = result
			},
			function (err) {
				console.log("[FBKCNT] ERROR!", err)
			}
		)
		if (this.fb.fan_count) {
			this.myCounter.incrementTo(this.fb.fan_count, 100, 20)
		}
	},

	loadJSON: function(path, success, error) {
		var xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (success) {
						success(JSON.parse(xhr.responseText))
					}
				} else {
					if (error) {
						error(xhr)
					}
				}
			}
		}
		xhr.open("GET", path, true)
		xhr.send()
	},
})
