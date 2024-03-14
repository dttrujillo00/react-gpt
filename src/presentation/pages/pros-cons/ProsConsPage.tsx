import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConsUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGPT: boolean;
}


export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text: text, isGPT: false }] );

    const { ok, content } = await prosConsUseCase(text);

    if( !ok ) {
      setMessages( (prev) => [...prev, { 
        text: 'No se pudo realizar la comparación',
        isGPT: true
       }] )
    } else {
      setMessages( (prev) => [...prev, {
        text: content,
        isGPT: true,
      }] )
    }

    setIsLoading(false)

    console.log(content)

    // TODO: Add el mensaje de isGPT en true
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Bienvenida */}
          <GptMessage text="Puedes escribir lo que sea que quieres que compare y te de mis puntos de vista" />

          {
            messages.map( (message, index) => (
              message.isGPT
              ? (
                <GptMessage key={ index } text={message.text} />
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
