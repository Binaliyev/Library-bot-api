const elUserTemp = document.querySelector(".js-user-temp").content;
const elUserList = document.querySelector(".js-user-list");
let images = ['https://bootdey.com/img/Content/avatar/avatar4.png', 'https://bootdey.com/img/Content/avatar/avatar3.png', 'https://bootdey.com/img/Content/avatar/avatar2.png', 'https://bootdey.com/img/Content/avatar/avatar1.png'];
class TelegramBot {
    #token = '';
    #base_url = '';
    #lastUpdateId = '';
    #params = {};
    constructor(token, params = {}){
        this.#token = token;
        this.#base_url = `https://api.telegram.org/bot${this.#token}` 
        this.#params = params
        this.#lastUpdateId = window.localStorage.getItem("update_id");
    }
    async #getUpdates(){
        const req = await fetch(this.#base_url + "/getUpdates" + (this.#lastUpdateId ? `?offset=${this.#lastUpdateId}`: '')); 
        let {result} = await req.json();
        if(this.#lastUpdateId == result[result.length-1].update_id) return 
        this.#lastUpdateId = result[result.length-1].update_id;
        window.localStorage.setItem('update_id', this.#lastUpdateId)
        return result[result.length-1]
    }
    on(type, callback){
        if(type == "message"){
            if(this.#params.hasOwnProperty("polling")){
                let {polling} = this.#params;
                if(polling) {
                    setInterval(async () => {
                        let res = await this.#getUpdates();
                        if(res) {
                            callback(res.message)
                            this.saveUser(res.message)
                        }
                    }, 500)
                }
            }
        };
    }
    async sendMessage(chatId, text, params = {}){
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
    async sendDocument(chatId, {files}, params = {}){
        let formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("document", files[0]);
        for(let key in params){
            formData.append(key, params[key])
        };
        let req = await fetch(this.#base_url + "/sendDocument", {
            method: "POST",
            body: formData
        });
        return await req.json();
    }
    #randomImage(){
        return images[Math.floor(Math.random() * images.length)];
    }
    saveUser(message){
        let users = JSON.parse(window.localStorage.getItem("data"));
        if(!(users[message.chat.id])){
            let newUser = { 
                full_name: message.chat.first_name,
                username: message.chat.username,
                messages: [{me: message.text}]
            }
            users[message.chat.id] = newUser;
            window.localStorage.setItem("data", JSON.stringify(users));
            this.renderUsers({[message.chat.id]: newUser})  
        }
    }
    renderUsers(users){
        users = users || JSON.parse(window.localStorage.getItem("data"));
        elUserList.innerHTML = ''
        for(let user in users){
            let clone = elUserTemp.cloneNode(true);
            clone.querySelector(".js-user-image").src = this.#randomImage();
            clone.querySelector(".name-meta").textContent = users[user].full_name
            elUserList.append(clone)
        };
    }
}

// let user = {
//     files: {
//         name: "Binali",
//         [0]: 'Salom'
//     }
// }
// let {files:{name}} = user
// console.log(name)