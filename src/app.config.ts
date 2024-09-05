import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { matchMaker } from "colyseus";
import {auth} from "@colyseus/auth";
import express from "express";
import {join} from "node:path";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";
import { Request } from "express";

let server

auth.oauth.addProvider("discord", {
    key: "1279737308228096063",
    secret: process.env.DISCORD,
    scope: ['identify', 'email'],
});


export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);
        gameServer.simulateLatency(100);
        matchMaker.create("my_room");
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */


        app.use(auth.prefix, auth.routes())

        console.log(__dirname)
        app.use("/", express.static(__dirname+"/dist"))

        app.get("/hello_world", auth.middleware(), (req:Request , res)  => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        app.get("/", (req, res)=>{
            res.sendFile(join(__dirname, "/dist/index.html"))
        })

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        // if (process.env.NODE_ENV !== "production") {
        //     app.use("/", playground)
        // }

        //console.log(process.env.DISCORD)
        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
