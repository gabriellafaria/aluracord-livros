import { useRouter } from "next/router";
import { Box, Button, Image, Text } from "@skynexui/components";
import appConfig from "../config.json";
import React from "react";

// function Title(props) {
//   const Tag = props.tag || "h1";
//   return (
//     <>
//       <Tag>{props.children}</Tag>
//       <style jsx>
//         {`
//           ${Tag} {
//             color: ${appConfig.theme.colors.neutrals["000"]};
//             font-size: 24px;
//             font-weight: 600;
//           }
//         `}
//       </style>
//     </>
//   );
// }

export default function Error() {
  const route = useRouter();

  function handleClick(event) {
    event.preventDefault();
    route.push("/");
  }
  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url(https://i.pinimg.com/564x/67/63/8e/67638eded2d2f5ee8ef28bcb14d1a5da.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            padding: "32px",
            margin: "16px",
          }}
        >
          <Box
            styleSheet={{
              display: {
                xs: "flex",
                md: "inline-block",
              },
              alignItems: "center",
              flexDirection: "column",
              width: "50%",
              padding: "32px",
              margin: "16px",
            }}
          >
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "20px",
                fontSize: {
                  xs: "24px",
                  md: "34px",
                  lg: "50px",
                },
                color: appConfig.theme.colors.neutrals["000"],
              }}
            >
              404 - Usuário inválido! 
            </Text>

            <Box
              styleSheet={{
                width: "100%",
                marginTop: "16px",
              }}
            >
              <Button
                type="onClick"
                label="Voltar"
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[600],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[500],
                }}
                onClick={handleClick}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}