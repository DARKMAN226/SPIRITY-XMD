const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/DARKMAN226/SPIRITY-XMD';

    try {
        // Extract username and repo name from the URL
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
            return reply("❌ Impossible de lire l'URL du dépôt GitHub.");
        }
        const [, username, repoName] = match;

        // Fetch repository details using GitHub API
        const apiUrl = `https://api.github.com/repos/${username}/${repoName}`;
        console.log("Fetching:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            return reply(`❌ GitHub API request failed with status ${response.status}`);
        }

        const repoData = await response.json();

        // Format the repository information
        const formattedInfo = `*BOT NAME:*\n> ${repoData.name}\n\n*OWNER NAME:*\n> ${repoData.owner.login}\n\n*STARS:*\n> ${repoData.stargazers_count}\n\n*FORKS:*\n> ${repoData.forks_count}\n\n*GITHUB LINK:*\n> ${repoData.html_url}\n\n*DESCRIPTION:*\n> ${repoData.description || 'No description'}\n\n*Don't Forget To Star and Fork Repository*\n\n> *© Powered By 𝙳̷𝚊̷𝚛̷𝚔̷-𝙳̷𝙴̷𝚟̷🩸*`;

        // Send image with caption
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/zmhz85.jpg` },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422353392657@newsletter',
                    newsletterName: '𝐒𝐏𝐈𝐑𝐈𝐓𝐘-𝐗𝐌𝐃 ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send local audio file
        const audioPath = path.join(__dirname, '../assets/menu.m4a');
        if (!fs.existsSync(audioPath)) {
            return reply("❌ Le fichier audio menu.m4a est introuvable.");
        }
        await conn.sendMessage(from, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363422353392657@newsletter',
                    newsletterName: 'SPIRITY-XMD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in repo command:", error);
        reply(`❌ Erreur lors de la récupération des infos du repo : ${error.message}`);
    }
});
