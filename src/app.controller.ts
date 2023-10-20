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
    return { message: 'success' };
  }

  @Post('auth')
  @Redirect('', 302)
  async initiateGoogleOAuth(@Req() req, @Res() res): Promise<any> {
    try {
      const oauthUrl = this.appService.getGoogleOAuthUrl();
      console.log('Link', oauthUrl);

      return { url: oauthUrl };
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      return res.redirect('/');
    }
  }

  @Get('auth/callback')
  async handleGoogleOAuthCallback(@Req() req, @Res() res) {
    const { code } = req.query;

    try {
      await this.appService.authenticateGoogle(code);
      return res.redirect('/');
    } catch (error) {
      console.error('Error handling callback:', error);
      return res.redirect('/');
    }
  }

  // get specific spreadsheet
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
