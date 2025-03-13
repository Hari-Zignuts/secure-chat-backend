import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Together from 'together-ai';

@Controller('ai')
export class AiController {
  constructor(private readonly configService: ConfigService) {}
  @Post()
  async postAi(@Body() body: { text: string }) {
    if (!body.text) {
      return 'Error: text is required';
    }
    const together = new Together({
      apiKey: this.configService.get('TOGETHER_API_KEY'),
    });

    const response = await together.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: body.text,
        },
      ],
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    });
    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message
    ) {
      return response.choices[0].message.content;
    } else {
      console.error('Response is missing expected properties');
      return 'Error: Response is missing expected properties';
    }
  }
}
