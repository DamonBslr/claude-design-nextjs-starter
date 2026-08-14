"use client"

import * as React from "react"
import { Bell, FileText, Folder, Plus, Settings, Users } from "lucide-react"

import { ActivityBarChart } from "@/components/component-showcase/activity-bar-chart"
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

const items = [
  { title: "Item one", meta: "Category A", icon: FileText },
  { title: "Item two", meta: "Category B", icon: Folder },
  { title: "Item three", meta: "Category A", icon: Users },
  { title: "Item four", meta: "Category C", icon: Bell },
  { title: "Item five", meta: "Category B", icon: Settings },
]

export function ShowcaseDashboard() {
  const [threshold, setThreshold] = React.useState([2500])
  const [page, setPage] = React.useState("1")

  return (
    <div className="flex-1 bg-muted/30 p-4 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card id="charts" className="scroll-mt-20 md:col-span-1">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityBarChart className="aspect-auto h-[180px] w-full" />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 border-t-0 bg-transparent">
              <div className="grid w-full grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Metric one
                  </p>
                  <p className="font-medium">1,240</p>
                  <p className="text-muted-foreground">+12% this month</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Metric two
                  </p>
                  <p className="font-medium">Active</p>
                  <p className="text-muted-foreground">Updated just now</p>
                </div>
              </div>
              <Button className="w-full">View report</Button>
            </CardFooter>
          </Card>

          <Card id="forms" className="scroll-mt-20">
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>
                Select, slider, textarea, and label primitives.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="option">Option</Label>
                <Select defaultValue="one">
                  <SelectTrigger id="option" className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one">Option one</SelectItem>
                    <SelectItem value="two">Option two</SelectItem>
                    <SelectItem value="three">Option three</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold">Threshold</Label>
                  <span className="font-mono text-sm tabular-nums">
                    {threshold[0] ?? 0}
                  </span>
                </div>
                <Slider
                  id="threshold"
                  min={500}
                  max={10000}
                  step={100}
                  value={threshold}
                  onValueChange={setThreshold}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add a note…"
                  className="min-h-20 resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t-0 bg-transparent pt-0">
              <Button className="w-full">Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Indeterminate placeholder goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Goal one
                  </p>
                  <p className="text-2xl font-medium tabular-nums">65%</p>
                </div>
                <Progress value={65} />
                <p className="text-xs text-muted-foreground">
                  650 of 1,000 completed
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Goal two
                  </p>
                  <p className="text-2xl font-medium tabular-nums">32%</p>
                </div>
                <Progress value={32} />
                <p className="text-xs text-muted-foreground">
                  320 of 1,000 completed
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t-0 bg-transparent">
              <p className="text-xs text-muted-foreground">
                Replace these cards with your own screens.
              </p>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border bg-muted/50">
                <Plus className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-medium">Empty state</h2>
                <p className="max-w-xs text-sm text-muted-foreground">
                  A starting point for the first thing your users create.
                </p>
              </div>
              <Button>Create</Button>
            </CardContent>
          </Card>

          <Card id="feedback" className="scroll-mt-20">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-4xl font-medium tabular-nums">0</p>
                <Badge variant="secondary" className="gap-1.5">
                  <span className="size-1.5 rounded-full bg-chart-4" />
                  Pending setup
                </Badge>
              </div>
              <Separator />
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-medium tabular-nums">0</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Pending</dt>
                  <dd className="font-medium tabular-nums">0</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>List</CardTitle>
                <CardDescription>Paginated placeholder rows</CardDescription>
              </div>
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                value={page}
                onValueChange={(value) => {
                  if (value) setPage(value)
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
                {items
                  .slice(page === "1" ? 0 : 3, page === "1" ? 3 : 5)
                  .map((item) => (
                    <li
                      key={item.title}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <item.icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.meta}
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
