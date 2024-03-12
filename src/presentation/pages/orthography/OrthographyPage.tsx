import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGPT: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}


export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text: text, isGPT: false }] );

    const { ok, userScore, errors, message } = await orthographyUseCase(text);

    if( !ok ) {
      setMessages( (prev) => [...prev, { 
        text: 'No se pudo realizar la correción',
        isGPT: true
       }] )
    } else {
      setMessages( (prev) => [...prev, {
        text: message,
        isGPT: true,
        info: {
          userScore,
          errors,
          message
        }
      }] )
    }


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
                <GptOrthographyMessage 
                  key={ index }
                  { ...message.info! } 
                />
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
