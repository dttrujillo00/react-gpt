import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../components";

interface Message {
  text: string;
  isGPT: boolean;
}


export const ChatTemplate = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text: text, isGPT: false }] );

    // TODO: UseCase

    setIsLoading(false)

    // TODO: Add el mensaje de isGPT en true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correciones" />

          {
            messages.map( (message, index) => (
              message.isGPT
              ? (
                <GptMessage key={ index } text="Esto es de OpenAI" />
              )
              : (
                <MyMessage key={ index } text={ message.text } />
              )
            ) )
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }



        </div>
      </div>

      <TextMessageBox 
        onSendMessage={ handlePost }
        placeholder="Escribe aqui"
        disableCorrections
      />

    </div>
  )
}
