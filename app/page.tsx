import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  const jobs = await prisma.jobs.findMany({
    where: {
      date: {
        // today minus 1 day
        gte: new Date(new Date().setDate(new Date().getDate() - 2)),
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 max-w-4xl m-auto">
      <h1 className="font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        RemoteJobsFinder
      </h1>
      <ul className="flex flex-col gap-2">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link href={job.url}>
              <Card className="hover:bg-muted/50">
                <CardHeader className="flex flex-row gap-4">
                  <div>
                    <Avatar>
                      <AvatarFallback>{job.company[0]}</AvatarFallback>
                      {job.logo ? (
                        <AvatarImage src={job.logo} alt={job.company} />
                      ) : null}
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-2">
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      {job.company} - {job.salary}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
