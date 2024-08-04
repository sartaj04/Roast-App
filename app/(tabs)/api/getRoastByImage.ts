import axios from "axios";
import { BASE_URL, OPEN_AI_API_KEY, RoastLevels } from "./BASE";

interface GetRoastByImageData {
  image: string;
  roastLevel: number;
  language: string;
}
export const getRoastByImage = async (data: GetRoastByImageData) => {
  return axios.post(
    BASE_URL,
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a fun, sassy roast of 250 characters for the below image. Make it ${
                RoastLevels[data.roastLevel]
              }. Write the roast in ${data.language}.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `${data.image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
      },
    }
  );
};
