import { Prisma } from '@prisma/client';
import pw, { Browser } from 'playwright';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const SBR_CDP = `wss://${process.env.BRIGHDATA_AUTH}@brd.superproxy.io:9222`;

export const GET = async (req: Request, res: Response) => {
  const browser = await pw.chromium.connectOverCDP(SBR_CDP);

  const jobs = await getRemoteOkJobs(browser);

  await prisma.jobs.createMany({
    data: jobs,
  });

  return NextResponse.json({
    jobs,
  });
};

const getRemoteOkJobs = async (instance: Browser) => {
  const page = await instance.newPage();
  await page.goto('https://remoteok.com/remote-engineer-jobs?order_by=date');

  const jobs = await page.$$eval('tr', (rows) => {
    return rows.map((row) => {
      if (row.classList.contains('ad')) return;

      // ligne
      const obj = {
        title: '',
        company: '',
        date: new Date(),
        logo: '',
        salary: '',
        url: '',
      } satisfies Prisma.JobsCreateManyInput;

      const h2Title = row.querySelector('h2');

      if (h2Title) {
        obj.title = h2Title.textContent?.trim() ?? '';
      }

      const h3Company = row.querySelector('h2');

      if (h3Company) {
        obj.company = h3Company.textContent?.trim() ?? '';
      }

      const hasLogoElement = row.querySelector('.has-logo');

      if (hasLogoElement) {
        const img = hasLogoElement.querySelector('img');
        obj.logo = img?.getAttribute('src') ?? '';
      }

      const url = row.getAttribute('data-url');
      if (url) {
        obj.url = 'https://remoteok.com' + url;
      }

      const locationsElements = row.querySelectorAll('.location');

      for (const locationElement of locationsElements) {
        const location = locationElement.textContent?.trim() ?? '';
        if (location.startsWith('💰')) {
          obj.salary = location;
        }
      }

      return obj;
    });
  });

  const jobsFiltered = jobs.filter((job) => {
    if (!job) return false;
    if (!job?.title) return false;
    if (!job?.url) return false;
    if (!job?.company) return false;
    return true;
  }) as Prisma.JobsCreateManyInput[];

  return jobsFiltered;
};
