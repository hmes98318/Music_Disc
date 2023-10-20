import express from 'express';

import type { Express } from 'express';
import type { Client } from 'discord.js';


const registerExpressEvents = (client: Client, app: Express) => {
    const views = `${process.cwd()}/views`;
    const js = `${process.cwd()}/views/js`;
    const css = `${process.cwd()}/views/css`;

    // app.use(express.static(views));
    app.use('/static/js', express.static(js));
    app.use('/static/css', express.static(css));


    /**
     * ---------- Site ----------
     */

    app.get('/dashboard', (req, res) => {
        res.sendFile(`${views}/dashboard.html`);
    });

    app.get('/nodeslist', (req, res) => {
        res.sendFile(`${views}/nodeslist.html`);
    });

    app.get('/serverlist', (req, res) => {
        res.sendFile(`${views}/serverlist.html`);
    });

    app.get('/servers/:id', (req, res) => {
        const server = client.guilds.cache.find((x) => x.id === req.params.id);

        if (!server) {
            res.redirect('/serverlist');
        }
        else {
            res.sendFile(`${views}/server.html`);
        }
    });


    /**
     * ---------- API ----------
     */

    app.get('/api/info', (req, res) => {
        // console.log('[api] /api/info', req.ip);

        const info = client.info
        res.json(info);
    });

    app.get('/api/serverlist', (req, res) => {
        // console.log('[api] /api/serverlist', req.ip);

        const allServer = client.guilds.cache;
        const playingServers = new Set(client.lavashark.players.keys());

        const serverlist = allServer.map((guild) => ({
            data: guild,
            active: playingServers.has(guild.id),
        }));

        res.send(serverlist);
    });

    app.get('/api/server/info/:guildID', async (req, res) => {
        // console.log(`[api] /api/server/info/${req.params.guildID}`, req.ip);

        const guild = client.guilds.cache.get(req.params.guildID);

        await guild!.members.fetch()
            .catch((_) => console.log(`Cache guild:${req.params.guildID} members list failed`));

        if (!guild) {
            res.send({});
        }
        else {
            res.send(guild);
        }
    });

    app.get('/api/user/:userID', (req, res) => {
        // console.log(`[api] /api/user/avatar/${req.params.id}`, req.ip);

        const user = client.users.cache.get(req.params.userID);
        res.send(user);
    });

    app.get('/api/lavashark/getThumbnail/:source/:id', (req, res) => {
        // console.log(`[api] /api/lavashark/getThumbnail/${req.params.source}/${req.params.id}`, req.ip);

        if (req.params.source === 'youtube') {
            res.send(`https://img.youtube.com/vi/${req.params.id}/sddefault.jpg`);
        }
        else {
            res.send('NOT_FOUND');
        }
    });




    app.use('*', (req, res) => {
        res.redirect('/dashboard');
    });
};

export { registerExpressEvents };