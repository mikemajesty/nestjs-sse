import { Controller, Get, MessageEvent, Res, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import {  Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private eventEmitter: EventEmitter2) { }

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Get("emit")
  emit() {
    //http://localhost:3002/sse emitir um evento por essa rota
    this.eventEmitter.emit("observando", { info: "email atuaizado com sucesso" })
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      this.eventEmitter.on('observando', (data) => {
        //envia evento para o front end
        subscriber.next({ data });
      });
    });
  }
}