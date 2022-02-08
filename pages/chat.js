import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../scr/components/ButtonSendSticker';
import { Bars } from 'react-loading-icons'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzUwNDY0MCwiZXhwIjoxOTU5MDgwNjQwfQ.lw41Dzu3FBXIWc9lvolT6JHBibgotuvNg2AxizuoIjQ';
const SUPABASE_URL = 'https://yaxeuxffirwfuztluzzd.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(addMessage) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (liveAnswer) => {
            addMessage(liveAnswer.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const root = useRouter();
    const userLogged = root.query.username;
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [messageList, setMessageList] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                //console.log('Dados da consulta:', data);
                setMessageList(data);
            });
        setLoading(false);


        const subscription = escutaMensagensEmTempoReal((newMessage) => {
            console.log('Nova mensagem:', newMessage);
            console.log('listaDeMensagens:', messageList);
            // Quero reusar um valor de referencia (objeto/array) 
            // Passar uma função pro setState

            setMessageList((valorAtualDaLista) => {
                console.log('valorAtualDaLista:', valorAtualDaLista);
                return [
                    newMessage,
                    ...valorAtualDaLista,
                ]
            });
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);


    // O que precisamos:
    // usuário:
    //  - usuário digita no compo (textarea)
    //  - uso so enter para enviar mensagem 
    //  - Tem que adicionar o texto enviado na listagem 

    // devs
    //  - Criar o campo 
    //  - onChange e useState (com if para ao clicar no enter limpar a variável)
    //  - Lista de mensagens 

    function handleNewMessage(newMessage) {
        const message = {
            de: userLogged,
            texto: newMessage,
        };
        supabaseClient
            .from('mensagens')
            .insert([
                //// Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                message
            ])
            .then(({ data }) => {
                console.log('Criando mensagem: ', data);
                /*  setListaDeMensagens([
                     data[0],
                     ...listaDeMensagens,
                 ]); */
            });
        setMessage('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                //backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://i.pinimg.com/564x/67/63/8e/67638eded2d2f5ee8ef28bcb14d1a5da.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply', backgroundPosition: 'center',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600], //interno
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {loading ? (
                        <Box
                            styleSheet={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                            }}
                        >
                            <Bars
                                fill={appConfig.theme.colors.primary["900"]}
                                height="16px"
                            />
                        </Box>
                    ) : (
                        <MessageList mensagens={messageList} setMensagens={setMessageList} />
                    )}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMessage(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '35px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            variant="primary"
                            colorVariant="positive"
                            label="Enviar"
                            styleSheet={{
                                borderRadius: '35px',
                                marginRight: '10px',
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[600],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[500],
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                handleNewMessage(message);
                            }}
                        />
                        {/* CallBack */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                                handleNewMessage(':sticker: ' + sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.de}.png`}
                            />
                            <Text tag="strong">
                                {message.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date(message.created_at).toLocaleString("pt-BR", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </Text>
                        </Box>
                        {message.texto.startsWith(':sticker:')
                            ? (
                                <Image src={message.texto.replace(':sticker:', '')} 
                                styleSheet={{
                                    maxWidth: '20vh'
                                }}
                                />
                            )
                            : (
                                message.texto
                            )}
                    </Text>
                );
            })}
        </Box>
    )
}