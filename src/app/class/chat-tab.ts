import { Network, EventSystem } from './core/system/system';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { ObjectStore } from './core/synchronize-object/object-store';
import { ObjectSerializer, InnerXml } from './core/synchronize-object/object-serializer';
import { ObjectNode } from './core/synchronize-object/object-node';
import { ChatMessage, ChatMessageContext } from './chat-message';

@SyncObject('chat-tab')
export class ChatTab extends ObjectNode implements InnerXml {
  @SyncVar() name: string = 'タブ';
  get chatMessages(): ChatMessage[] { return <ChatMessage[]>this.children; }

  initialize(needUpdate: boolean = true) {
    super.initialize(needUpdate);
    EventSystem.register(this)
      .on<ChatMessageContext>('BROADCAST_MESSAGE', 200, event => {
        if (!event.isSendFromSelf) return;
        if (event.data.tabIdentifier !== this.identifier) return;
        let chat = new ChatMessage();
        let message = event.data;
        for (let key in message) {
          if (key === 'identifier') continue;
          if (key === 'tabIdentifier') continue;
          if (key === 'text') {
            chat.value = message[key];
            continue;
          }
          if (message[key] == null || message[key] === '') continue;
          chat.setAttribute(key, message[key]);
        }
        chat.initialize();
        this.appendChild(chat);

        event.data.identifier = chat.identifier;
      });
  }

  addMessage(message: ChatMessageContext) {
    message.tabIdentifier = this.identifier;
    console.log('TRIGGER_DICEBOT', message);
    EventSystem.call('TRIGGER_DICEBOT', message);
  }

  innerXml(): string {
    let xml = '';
    for (let child of this.children) {
      if (child instanceof ChatMessage && !child.isDisplayable) continue;
      xml += ObjectSerializer.instance.toXml(child);
    }
    return xml;
  };

  parseInnerXml(element: Element) {
    return super.parseInnerXml(element);
  };
}
