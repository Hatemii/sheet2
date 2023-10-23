import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Redirect,
  Inject,
  Query,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService;

  @Get()
  homepage(): any {
    return 'welcome to homepage';
  }

  @Post('auth/google')
  @Redirect('', 302)
  async initiateGoogleOAuth(@Req() req, @Res() res): Promise<any> {
    try {
      const oauthUrl = this.appService.getGoogleOAuthUrl();
      console.log('Link', oauthUrl);

      return 'success';
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      throw error;
    }
  }

  @Get('auth/google/callback')
  async handleGoogleOAuthCallback(@Req() req, @Res() res) {
    const { code } = req.query;

    try {
      const { tokens } = await this.appService.authenticateGoogle(code);
      return res.json({ tokens });
    } catch (error) {
      console.error('Error handling callback:', error);
      throw error;
    }
  }

  // get spreadsheet by id
  @Get('spreadSheet')
  async getSheetData(
    @Headers() headers,
    @Query('spreadsheetId') spreadsheetId: string,
    @Query('range') range?: string,
  ): Promise<any> {
    const accessToken = headers.authorization;
    
    try {
      const response = this.appService.getSheetData(
        accessToken,
        spreadsheetId,
        range,
      );
      return response;
    } catch (error) {
      console.error('Error message:', error);
      throw error;
    }
  }
}
