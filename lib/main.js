let TOKEN = '7605593724:AAHm38SZ977iBQiHir8tAGrj-TAAZGX1flM'
let audios = document.querySelector('#audio');
let app = new TelegramBot(TOKEN, { polling: true });
app.on("message", (msg) => {
    console.log(msg)
    if (msg.text == '/audio') {
        let chat_id = msg.chat.id;
        let audioPath = audios;
        app.sendAudio(chat_id, audioPath);
    }
});
app.renderUsers();

let data = {
    1500754703: {
        full_name: "Shohijahon Musinkulov",
        username: "@shokhijakhon_dev",
        messages: { me: "/start" }
    }
}
window.localStorage.setItem("data", JSON.stringify(data))
