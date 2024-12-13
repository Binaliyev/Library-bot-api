let TOKEN = '7605593724:AAHm38SZ977iBQiHir8tAGrj-TAAZGX1flM'
let audios = document.querySelector('#audio');
let app = new TelegramBot(TOKEN, { polling: true });
app.on("message", (msg) => {
    console.log(msg)
    if (msg.text == '/audio') {
        let chat_id = msg.chat.id;
        let audioPath = audios;
        app.sendAudio(chat_id, audioPath);
        console.log('ogabek Norqulov');
        
    }
});
app.renderUsers();
const elSendbtn = document.querySelector(".reply-send");
let TOKEN = '7605593724:AAHm38SZ977iBQiHir8tAGrj-TAAZGX1flM';
let filess = document.querySelector('#file')
let app = new TelegramBot(TOKEN, {polling: true})
app.on("message", (msg) => {
    let chat_id = msg.chat.id;
    
}); 
app.renderUsers();
app.renderMessages(window.localStorage.getItem("lastchildId"));

const handleSub = (evt) => {
    let message = comment.value.trim();
    if(!message) return alert('Xabarni yozing !');
    let chat_id = window.localStorage.getItem("lastchildId");
    app.sendMessage(chat_id, message);
    app.saveMessage({chat: {id: chat_id}, text: message}, 'me');
    app.renderMessages(chat_id);
}

elSendbtn.addEventListener("click", handleSub)
// let data = {
//     1500754703: {
//         full_name: "Shohijahon Musinkulov",
//         username: "@shokhijakhon_dev",
//         messages: { me: "/start" }
//     }
// }
// window.localStorage.setItem("data", JSON.stringify(data))
//         messages: [{'bot': "/start"}]
//     }
// }
// window.localStorage.setItem("data", JSON.stringify(data))