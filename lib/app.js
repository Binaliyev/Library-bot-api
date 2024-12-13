const elUserMessageList = document.querySelector(".message-body");
const elMessageTemp = document.querySelector(".js-user-message").content
const elUserTemp = document.querySelector(".js-user-temp").content;
const elMeMessageTemp = document.querySelector(".js-me-message-temp").content;
const elUserList = document.querySelector(".js-user-list");
const elActiveUsersName = document.querySelector(".heading-name-meta");
let images = ['https://bootdey.com/img/Content/avatar/avatar4.png', 'https://bootdey.com/img/Content/avatar/avatar3.png', 'https://bootdey.com/img/Content/avatar/avatar2.png', 'https://bootdey.com/img/Content/avatar/avatar1.png'];
class TelegramBot {
    #token = '';
    #base_url = '';
    #lastUpdateId = '';
    #params = {};
    constructor(token, params = {}) {
        this.#token = token;
        this.#base_url = `https://api.telegram.org/bot${this.#token}`
        this.#params = params
        this.#lastUpdateId = window.localStorage.getItem("update_id");
    }
    async #getUpdates() {
        const req = await fetch(this.#base_url + "/getUpdates" + (this.#lastUpdateId ? `?offset=${this.#lastUpdateId}` : ''));
        let { result } = await req.json();
        if (this.#lastUpdateId == result[result.length - 1].update_id) return
        this.#lastUpdateId = result[result.length - 1].update_id;
        window.localStorage.setItem('update_id', this.#lastUpdateId)
        return result[result.length - 1]
    }
    on(type, callback) {
        if (type == "message") {
            if (this.#params.hasOwnProperty("polling")) {
                let { polling } = this.#params;
                if (polling) {
                    setInterval(async () => {
                        let res = await this.#getUpdates();

                        if(res) {
                            callback(res.message);
                            this.saveUser(res.message);
                            this.saveMessage(res.message, 'bot');
                        }

                        if (res) {
                            callback(res.message)
                            this.saveUser(res.message)
                        }
                    }, 500)
                }
            }
        };
    };

    async sendVideo(chatId, {files}, params = {}){
        let formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("video", files[0]);
        for(let key in params){
            formData.append(key, params[key])
        };
        let req = await fetch(this.#base_url + "/sendVideo", {
            method: "POST",
            body: formData
        });
        return await req.json();
    }
    async sendMessage(chatId, text, params = {}) {
        const req = await fetch(this.#base_url + "/sendMessage", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                ...params
            })
        })
        return await req.json();
    }
    async sendDocument(chatId, { files }, params = {}) {
        let formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("document", files[0]);
        for (let key in params) {
            formData.append(key, params[key])
        };
        let req = await fetch(this.#base_url + "/sendDocument", {
            method: "POST",
            body: formData
        });
        return await req.json();
    }
     async sendAnimation(chat_id, { files }, params = {}) {
        let formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("animation", files[0]);
        for (const key in params) {
            formData.append(key, params[key]);
        };
        let req = await fetch(this.#base_url + "/sendAnimation", {
            method: "POST",
            body: formData
        });
        return await req.json();
    }
    #randomImage(){
        return images[Math.floor(Math.random() * images.length)];
    };
    async sendAudio(chatId, { files }, title = {}) {
        let formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('audio', files[0]);
        for (let keys in title) {
            formData.append(keys, title[keys])
        }
        let req = await fetch(this.#base_url + '/sendAudio', {
            method: 'POST',
            body: formData,
        });
        console.log(req);
        console.log('method ishladiku');
        
        return await req.json();
    }
    saveMessage(message, type){
        console.log(message)
        let users = JSON.parse(window.localStorage.getItem("data"));
        users[message.chat.id].messages.push({[type]: message.text});
        window.localStorage.setItem('data', JSON.stringify(users));
    }
    saveUser(message) {
        let users = JSON.parse(window.localStorage.getItem("data"));
        if (!(users[message.chat.id])) {
            let newUser = {
                full_name: message.chat.first_name,
                username: message.chat.username,
                messages: [{'bot': message.text}]
            }
            users[message.chat.id] = newUser;
            window.localStorage.setItem("data", JSON.stringify(users));
            this.renderUsers({ [message.chat.id]: newUser })
        }
    }
    #activeUser(chatId){
        let users = JSON.parse(window.localStorage.getItem("data"));
        elUserList.querySelectorAll(`.js-user-image`).forEach(item => {
            if(item.className.includes(chatId)){
                activeUserImage.src = item.src;
            }
        })
        elActiveUsersName.textContent = users[chatId].full_name
    }
    renderUsers(users){
        if(users){
            users = users
        }else {
            users =  JSON.parse(window.localStorage.getItem("data"));
            elUserList.innerHTML = ''
        }
        for (let user in users) {
            let clone = elUserTemp.cloneNode(true);
            let image = this.#randomImage()
            clone.querySelector(".js-user-image").src = image;
            clone.querySelector(".js-user-image").classList.add(`${user}`);
            clone.querySelector(".name-meta").textContent = users[user].full_name
            clone.querySelector(".sideBar-body").onclick = () => {
                window.localStorage.setItem("lastchildId", user);
                this.renderMessages(user);
                this.#activeUser(user)
            }
            elUserList.append(clone)
        }
    }
}
    renderMessages(chatId){
        chatId = chatId || console.log(window.localStorage.getItem("lastchildId"));
        let users = JSON.parse(window.localStorage.getItem("data"));
        const {messages} = users[chatId];
        elUserMessageList.innerHTML = '';
        elMeMessageTemp.innerHTML = '';
        for(let message of messages){
            if(message['bot']){
                let clone = elMessageTemp.cloneNode(true);
                clone.querySelector(".message-text").textContent = message['bot']
                elUserMessageList.append(clone)
                this.#activeUser(chatId)
            };
            if(message['me']){
                let clone = elMeMessageTemp.cloneNode(true);
                clone.querySelector(".message-text").textContent = message['me']
                elUserMessageList.append(clone)
                this.#activeUser(chatId)
            }
        } 
    }
}
