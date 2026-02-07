import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About Bobbypicks</h1>
        <p className="text-muted-foreground mt-1">
          Understanding our tool and responsible gambling
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          Bobbypicks is provided for informational and entertainment purposes only. This tool does
          not constitute financial advice, betting recommendations, or guaranteed outcomes.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            What is Bobbypicks?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            Bobbypicks is a decentralized analytical tool designed to identify potential value
            opportunities in player prop markets by comparing PrizePicks lines against sharp
            sportsbook consensus data.
          </p>
          <p>
            Our system flags props where significant line discrepancies exist and provides
            verification data including recent player performance and defensive matchup ratings to
            help you make more informed decisions.
          </p>
          <p className="font-semibold text-foreground">
            This tool does NOT place bets on your behalf. All betting decisions and actions are
            entirely your responsibility.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Responsible Gambling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="font-semibold text-foreground">
            Gambling should be entertaining, not a way to make money.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Only bet what you can afford to lose</li>
            <li>Set strict limits on time and money spent gambling</li>
            <li>Never chase losses or bet under the influence</li>
            <li>Take regular breaks and maintain perspective</li>
            <li>Seek help if gambling becomes a problem</li>
          </ul>
          <div className="bg-muted rounded-lg p-4 mt-4">
            <p className="font-medium mb-2">Need Help?</p>
            <p className="text-muted-foreground">
              National Problem Gambling Helpline:{' '}
              <a href="tel:1-800-522-4700" className="underline hover:text-foreground">
                1-800-522-4700
              </a>
            </p>
            <p className="text-muted-foreground">
              Visit{' '}
              <a
                href="https://www.ncpgambling.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                ncpgambling.org
              </a>{' '}
              for resources and support.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>No Guarantees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Past performance does not guarantee future results.</strong> Sports outcomes are
            inherently unpredictable, and even the most sophisticated analysis cannot eliminate
            risk.
          </p>
          <p>
            Line discrepancies may exist for legitimate reasons including injury news, lineup
            changes, or market inefficiencies that correct quickly. Always do your own research and
            never rely solely on automated tools.
          </p>
          <p className="text-muted-foreground">
            The creators and operators of Bobbypicks are not responsible for any financial losses
            incurred through the use of this tool. Use at your own risk.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources & Methodology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            Bobbypicks aggregates data from multiple sources including sportsbook APIs and daily
            fantasy providers. Edge calculations are based on comparing PrizePicks lines against a
            consensus of sharp sportsbook lines.
          </p>
          <p>
            Verification data includes recent player performance trends and defensive matchup
            ratings. High Confidence designations are assigned when multiple verification factors
            align with the detected edge.
          </p>
          <p className="text-muted-foreground">
            Data accuracy depends on third-party providers and may contain errors or delays. Always
            verify information independently before making decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
