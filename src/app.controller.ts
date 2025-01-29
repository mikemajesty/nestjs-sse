import { Controller, Get, MessageEvent, Param, Res, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import {  Observable } from 'rxjs';

const EVENT = "observando";

@Controller()
export class AppController {
  constructor(private eventEmitter: EventEmitter2) { }

  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Get("emit/:id")
  emit(@Param("id") id: string) {
    //http://localhost:3002/emit/2 emitir um evento por essa rota
    //http://localhost:3002/emit/1 emitir um evento por essa rota
    this.eventEmitter.emit(EVENT.concat(id), { info: "email atuaizado com sucesso" })
  }

  @Sse('sse/:id')
  sse(@Param("id") id: string): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      this.eventEmitter.on(EVENT.concat(id), (data) => {
        //envia evento para o front end
        subscriber.next({ data });
      });
    });
  }
}