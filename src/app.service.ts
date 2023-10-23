import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class AppService {
  private readonly oAuth2Client: OAuth2Client;
  private readonly sheets: any;

  constructor() {
    this.oAuth2Client = new OAuth2Client({
      clientId:
        '108529931883-9d39tv7obbio7abd2srkrcv3umtqshkj.apps.googleusercontent.com',
      clientSecret: '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',
      redirectUri: 'http://localhost:3000/auth/callback',
    });

    this.sheets = google.sheets('v4');
  }

  getGoogleOAuthUrl(): string {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
      include_granted_scopes: true,
    });
    return authUrl;
  }

  async authenticateGoogle(code: string) {
    try {
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      return { tokens: tokens };
    } catch (error) {
      console.error('Error exchanging authorization code for tokens:', error);
      throw error;
    }
  }

  // get specific spreadsheet
  // all data A1:Z1000
  async getSheetData(
    accessToken: string,
    spreadsheetId: string,
    range = 'A1:Z1000',
  ) {
    const response = await this.sheets.spreadsheets.values.get({
      headers: {
        Authorization: accessToken,
      },
      spreadsheetId,
      range,
    });

    return response.data;
  }
}
