let TOKEN = '7605593724:AAHm38SZ977iBQiHir8tAGrj-TAAZGX1flM';
let filess = document.querySelector('#file')
let app = new TelegramBot(TOKEN, {polling: true})
app.on("message", (msg) => {
    console.log(msg)
    let chat_id = msg.chat.id;
    // app.sendMessage(chat_id, '<b>Salom</b>', {
    //     parse_mode: "HTML"
    // })
    // app.sendDocument(chat_id, file, {caption: "Bu birorta file"})
    if(msg.text == "/gif") app.sendAnimation(chat_id, file);
    if(msg.text == "/video") {
        app.sendVideo(chat_id, filess, {caption: "elClasico"});
    }
    app.sendMessage(chat_id, '<b>Salom</b>', {
        parse_mode: "HTML"
    })
    // app.sendDocument(chat_id, file, {caption: "Bu birorta rasm"})
});
app.renderUsers();
// renderUsers
// SaveUsers
// SaveMessages

let data = {
    1500754703:{
        full_name: "Shohijahon Musinkulov",
        username: "@shokhijakhon_dev",
        messages: {me: "/start"}
    }
}
window.localStorage.setItem("data", JSON.stringify(data))

// OG'ABEK sendAudio
// Shamsiddin sendVideo
// Ja'farbek sendLocation
// To'lqin sendContact
// Binali sendAnimation
// Ibrohimbek sendPhoto