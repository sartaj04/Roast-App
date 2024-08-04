import axios from "axios";
import { BASE_URL, OPEN_AI_API_KEY, RoastLevels } from "./BASE";

interface GetRoastByDescData {
  description: string;
  roastLevel: number;
  language: string;
}

export const getRoastByDesc = async (data: GetRoastByDescData) => {
  return axios.post(
    BASE_URL,
    {
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Create a roast for a person with the following description: ${
            data.description
          } make it ${RoastLevels[data.roastLevel]} and in the language ${
            data.language
          }`,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
      },
    }
  );
};
