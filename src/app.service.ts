import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  async launchBrowser(headless = true) {
    const browser = await puppeteer.launch({ headless, timeout: 0 });
    const page = await browser.newPage();
    return { browser, page };
  }
}
