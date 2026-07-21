"use client"

import * as React from "react"
import {
  Car,
  Coffee,
  Music2,
  Plus,
  ShoppingBag,
  Utensils,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ContributionBarChart } from "@/components/component-showcase/contribution-bar-chart"
import { Label } from "@workspace/ui/components/label"
import { Progress } from "@workspace/ui/components/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Slider } from "@workspace/ui/components/slider"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

const transactions = [
  {
    title: "Blue Bottle Coffee",
    category: "Food & Drink",
    icon: Coffee,
  },
  {
    title: "Uber Trip",
    category: "Travel",
    icon: Car,
  },
  {
    title: "Spotify Premium",
    category: "Entertainment",
    icon: Music2,
  },
  {
    title: "Whole Foods Market",
    category: "Groceries",
    icon: ShoppingBag,
  },
  {
    title: "Sweetgreen",
    category: "Food & Drink",
    icon: Utensils,
  },
]

export function ShowcaseDashboard() {
  const [payoutAmount, setPayoutAmount] = React.useState([2500])
  const [transactionPage, setTransactionPage] = React.useState("1")

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card id="charts" className="md:col-span-1 scroll-mt-20">
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Last 6 months of activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionBarChart className="aspect-auto h-[180px] w-full" />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 border-t-0 bg-transparent">
              <div className="grid w-full grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Upcoming
                  </p>
                  <p className="font-medium">Jun 12, 2024</p>
                  <p className="text-muted-foreground">$1,240.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Auto-save plan
                  </p>
                  <p className="font-medium">Active</p>
                  <p className="text-muted-foreground">15% of royalties</p>
                </div>
              </div>
              <Button className="w-full">View Full Report</Button>
            </CardFooter>
          </Card>

          <Card id="forms" className="scroll-mt-20">
            <CardHeader>
              <CardTitle>Payout Threshold</CardTitle>
              <CardDescription>
                Set your minimum balance for automatic payouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">
                      USD — United States Dollar
                    </SelectItem>
                    <SelectItem value="eur">EUR — Euro</SelectItem>
                    <SelectItem value="gbp">GBP — British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="payout-amount">Minimum Payout Amount</Label>
                  <span className="font-mono text-sm tabular-nums">
                    ${payoutAmount[0]?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <Slider
                  id="payout-amount"
                  min={500}
                  max={10000}
                  step={100}
                  value={payoutAmount}
                  onValueChange={setPayoutAmount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any specific instructions for your payout processor..."
                  className="min-h-20 resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t-0 bg-transparent pt-0">
              <Button className="w-full">Save Threshold</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Targets</CardTitle>
              <CardDescription>Active milestones for 2024</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Retirement
                  </p>
                  <p className="font-heading text-2xl font-medium tabular-nums">
                    $45,200
                  </p>
                </div>
                <Progress value={65} />
                <p className="text-xs text-muted-foreground">65% of $70,000</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Real Estate
                  </p>
                  <p className="font-heading text-2xl font-medium tabular-nums">
                    $12,800
                  </p>
                </div>
                <Progress value={32} />
                <p className="text-xs text-muted-foreground">32% of $40,000</p>
              </div>
            </CardContent>
            <CardFooter className="border-t-0 bg-transparent">
              <p className="text-xs text-muted-foreground">
                On track to reach Real Estate goal by November.
              </p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border bg-muted/50">
                <Plus className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-xl font-medium">
                  Distribute Track
                </h2>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Upload your latest master to start earning royalties across
                  all major platforms.
                </p>
              </div>
              <Button>Create Release</Button>
            </CardContent>
          </Card>

          <Card id="feedback" className="scroll-mt-20">
            <CardHeader>
              <CardTitle>Claimable Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="font-heading text-4xl font-medium tabular-nums">
                  $0.00
                </p>
                <Badge variant="secondary" className="gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  Pending Setup
                </Badge>
              </div>
              <Separator />
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Net Royalties</dt>
                  <dd className="font-medium tabular-nums">$0.00</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Processing Fee</dt>
                  <dd className="font-medium tabular-nums">-$0.00</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest activity</CardDescription>
              </div>
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                value={transactionPage}
                onValueChange={(value) => {
                  if (value) setTransactionPage(value)
                }}
              >
                <ToggleGroupItem value="1" aria-label="Page 1">
                  01
                </ToggleGroupItem>
                <ToggleGroupItem value="2" aria-label="Page 2">
                  02
                </ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {transactions
                  .slice(
                    transactionPage === "1" ? 0 : 3,
                    transactionPage === "1" ? 3 : 5
                  )
                  .map((tx) => (
                    <li
                      key={tx.title}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <tx.icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{tx.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.category}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
