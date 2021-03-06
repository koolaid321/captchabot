const discord = require('discord.js')
const client = new discord.Client()

const Captcha = require("@haileybot/captcha-generator")

client.on('ready', () => {
    console.log("MY NAME - " + client.user.username + "\n" + "MY PREFIX - " + PREFIX)
})


client.on("guildMemberAdd", async (member) => {
    let captcha = new Captcha();


    let channel = member.guild.channels.cache.find((x) => x.name === "verify")


    let vrole = member.guild.roles.cache.find((x) => x.name === "Non-Verified")
    let vrrole = member.guild.roles.cache.find((x) => x.name === "Verified")

    

    member.roles.add(vrole)
    const attachment = new discord.MessageAttachment(captcha.PNGStream, "captcha.png")
    const verifycode = await channel.send("**Type the following code to verify.**", attachment)
    let collector = channel.createMessageCollector(
        m => m.author.id === member.id
    )

    collector.on("collect", m => {
        if(m.content.toUpperCase() === captcha.value) {
            member.roles.remove(vrole)
            member.send("You were successfully verified.")
            member.roles.add(vrrole)
        } else if(m.content.toUpperCase() !== captcha.value) {
            m.delete()
            verifycode.delete()

            member.send("Verification failed, rejoin to verify again.")

           
        } else{
            verifycode.delete()
        }
    })
})

client.login(process.env.TOKEN);
