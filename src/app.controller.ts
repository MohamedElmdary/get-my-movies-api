import {
  Controller,
  Get,
  Param,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';
import { EGYBEST_API } from './apis';
import axios from 'axios';
import { AppService } from './app.service';

interface SearchQuery {
  t: string;
  u: string;
  i: string;
}

interface Quality {
  quality: string;
  size: string;
  url: Array<string>;
}

@Controller('api')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/search/:query')
  async searchApi(@Param('query') query: string): Promise<Array<SearchQuery>> {
    try {
      const { data } = await axios.get(EGYBEST_API.search(query));
      return data[query] || [];
    } catch {
      return [];
    }
  }

  @Get('/qualities/movie/:name')
  async qualitiesApi(@Param('name') name: string): Promise<Array<Quality>> {
    const { browser, page } = await this.appService.launchBrowser();
    await page.goto(EGYBEST_API.movieUrl(name));
    const urls = await page.evaluate(() => {
      const qualities = Array.from(
        document.querySelectorAll('table.dls_table tr'),
      );
      qualities.splice(0, 1);
      return qualities.map(tr => {
        const url = tr
          .querySelector('a')
          .getAttribute('data-url')
          .slice(10);
        return {
          quality: tr.querySelector('td:nth-of-type(2)').textContent,
          size: tr.querySelector('td:nth-of-type(3)').textContent,
          url: url.split('&auth='),
        } as Quality;
      });
    });
    browser
      .close()
      .then()
      .catch();
    return urls;
  }

  @Get('/download/:call/:auth')
  async downloadApi(@Param('call') call: string, @Param('auth') auth: string) {
    try {
      if (!call.length || !auth.length) {
        throw new Error('Invalid Request!');
      }
      const { browser, page } = await this.appService.launchBrowser();
      await page.goto(
        EGYBEST_API.movieRedirect(`/api?call=${call}&auth=${auth}`),
      );
      await page.evaluate(() => {
        (document.querySelector('.bigbutton') as any).click();
      });
      await page.waitForRequest((req: any) =>
        req.url().includes('/cv.php?verify='),
      );
      await page.waitForResponse(res => res.url().includes('/cv.php?verify='));
      const url = await page.evaluate(() => {
        return window.location.href;
      });
      await page.goto(url + '&r');
      const downloadLink = await page.evaluate(() => {
        return document.querySelector('.bigbutton').getAttribute('href');
      });
      browser
        .close()
        .then()
        .catch(() => null);
      return { link: downloadLink };
    } catch {
      throw new NotFoundException();
    }
  }

  @Get('/qualities/series/:name')
  async qualitiesSeriesApi() {
    throw new ServiceUnavailableException(
      'Currently, We Are Not Supporting Series.',
    );
  }
}
