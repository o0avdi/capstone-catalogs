import { parseDate } from "@internationalized/date"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  InboxIcon,
  InfoIcon,
  MailIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import {
  Button as AriaButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover as AriaPopover,
} from "react-aria-components"

import * as AlertUI from "@/components/ui/alert"
import * as AlertDialogUI from "@/components/ui/alert-dialog"
import * as AspectRatioUI from "@/components/ui/aspect-ratio"
import * as AttachmentUI from "@/components/ui/attachment"
import * as AvatarUI from "@/components/ui/avatar"
import * as BadgeUI from "@/components/ui/badge"
import * as BreadcrumbUI from "@/components/ui/breadcrumb"
import * as BubbleUI from "@/components/ui/bubble"
import * as ButtonUI from "@/components/ui/button"
import * as ButtonGroupUI from "@/components/ui/button-group"
import * as CalendarUI from "@/components/ui/calendar"
import * as CardUI from "@/components/ui/card"
import * as CarouselUI from "@/components/ui/carousel"
import * as ChartUI from "@/components/ui/chart"
import * as CheckboxUI from "@/components/ui/checkbox"
import * as CollapsibleUI from "@/components/ui/collapsible"
import * as ComboboxUI from "@/components/ui/combobox"
import * as CommandUI from "@/components/ui/command"
import * as ContextMenuUI from "@/components/ui/context-menu"
import * as DialogUI from "@/components/ui/dialog"
import * as DirectionUI from "@/components/ui/direction"
import * as DrawerUI from "@/components/ui/drawer"
import * as DropdownMenuUI from "@/components/ui/dropdown-menu"
import * as EmptyUI from "@/components/ui/empty"
import * as FieldUI from "@/components/ui/field"
import * as HoverCardUI from "@/components/ui/hover-card"
import * as InputUI from "@/components/ui/input"
import * as InputGroupUI from "@/components/ui/input-group"
import * as InputOtpUI from "@/components/ui/input-otp"
import * as ItemUI from "@/components/ui/item"
import * as KbdUI from "@/components/ui/kbd"
import * as LabelUI from "@/components/ui/label"
import * as MarkerUI from "@/components/ui/marker"
import * as MessageUI from "@/components/ui/message"
import * as MessageScrollerUI from "@/components/ui/message-scroller"
import * as NativeSelectUI from "@/components/ui/native-select"
import * as PaginationUI from "@/components/ui/pagination"
import * as PopoverUI from "@/components/ui/popover"
import * as ProgressUI from "@/components/ui/progress"
import * as QuestionnaireUI from "@/components/ui/questionnaire"
import * as RadioGroupUI from "@/components/ui/radio-group"
import * as ResizableUI from "@/components/ui/resizable"
import * as ScrollAreaUI from "@/components/ui/scroll-area"
import * as SelectUI from "@/components/ui/select"
import * as SeparatorUI from "@/components/ui/separator"
import * as SheetUI from "@/components/ui/sheet"
import * as SidebarUI from "@/components/ui/sidebar"
import * as SkeletonUI from "@/components/ui/skeleton"
import * as SliderUI from "@/components/ui/slider"
import * as SonnerUI from "@/components/ui/sonner"
import * as SpinnerUI from "@/components/ui/spinner"
import * as SwitchUI from "@/components/ui/switch"
import * as TableUI from "@/components/ui/table"
import * as TabsUI from "@/components/ui/tabs"
import * as TextareaUI from "@/components/ui/textarea"
import * as ToggleUI from "@/components/ui/toggle"
import * as ToggleGroupUI from "@/components/ui/toggle-group"
import * as TooltipUI from "@/components/ui/tooltip"

export function DemoCanvas({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-[22rem] flex-wrap items-start gap-4 p-4">{children}</div>
}

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartUI.ChartConfig

const payments = [
  ["success", "ken99@example.com", "$316.00"],
  ["processing", "monserrat@example.com", "$837.00"],
  ["failed", "carmella@example.com", "$721.00"],
]

export function ComponentDemo({ component, state }: { component: string; state: string }) {
  switch (component) {
    case "alert":
      return <AlertUI.Alert variant={state === "Destructive" ? "destructive" : "default"}><CircleAlertIcon/><AlertUI.AlertTitle>{state === "Destructive" ? "Payment failed" : "Account updated"}</AlertUI.AlertTitle><AlertUI.AlertDescription>Your changes have been saved successfully.</AlertUI.AlertDescription>{state === "WithAction" && <AlertUI.AlertAction><ButtonUI.Button variant="outline" size="sm">Undo</ButtonUI.Button></AlertUI.AlertAction>}</AlertUI.Alert>
    case "alert-dialog":
      return <AlertDialogUI.AlertDialogTrigger><ButtonUI.Button variant={state === "Destructive" ? "destructive" : "outline"}>Open confirmation</ButtonUI.Button><AlertDialogUI.AlertDialog><AlertDialogUI.AlertDialogHeader><AlertDialogUI.AlertDialogTitle>Are you absolutely sure?</AlertDialogUI.AlertDialogTitle><AlertDialogUI.AlertDialogDescription>This action cannot be undone.</AlertDialogUI.AlertDialogDescription></AlertDialogUI.AlertDialogHeader><AlertDialogUI.AlertDialogFooter><AlertDialogUI.AlertDialogCancel>Cancel</AlertDialogUI.AlertDialogCancel><AlertDialogUI.AlertDialogAction>Continue</AlertDialogUI.AlertDialogAction></AlertDialogUI.AlertDialogFooter></AlertDialogUI.AlertDialog></AlertDialogUI.AlertDialogTrigger>
    case "aspect-ratio":
      return <div className={state === "Square" ? "w-64" : "w-[30rem]"}><AspectRatioUI.AspectRatio ratio={state === "Square" ? 1 : 16 / 9}><div className="flex size-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">{state === "Square" ? "1:1" : "16:9"} media</div></AspectRatioUI.AspectRatio></div>
    case "attachment":
      return <AttachmentUI.AttachmentGroup className="w-[34rem]"><AttachmentUI.Attachment aria-disabled={state === "Disabled" || undefined} className={state === "Disabled" ? "opacity-50" : undefined}><AttachmentUI.AttachmentMedia><div className="rounded bg-muted p-2 text-xs">PDF</div></AttachmentUI.AttachmentMedia><AttachmentUI.AttachmentContent><AttachmentUI.AttachmentTitle>quarterly-report.pdf</AttachmentUI.AttachmentTitle><AttachmentUI.AttachmentDescription>2.4 MB · Ready</AttachmentUI.AttachmentDescription></AttachmentUI.AttachmentContent><AttachmentUI.AttachmentActions><AttachmentUI.AttachmentAction aria-label="More options"><MoreHorizontalIcon/></AttachmentUI.AttachmentAction></AttachmentUI.AttachmentActions></AttachmentUI.Attachment></AttachmentUI.AttachmentGroup>
    case "avatar":
      return <DemoCanvas><AvatarUI.Avatar><AvatarUI.AvatarImage src="https://github.com/shadcn.png" alt="shadcn"/><AvatarUI.AvatarFallback>SC</AvatarUI.AvatarFallback>{state === "WithBadge" && <AvatarUI.AvatarBadge/>}</AvatarUI.Avatar><AvatarUI.Avatar><AvatarUI.AvatarFallback>ED</AvatarUI.AvatarFallback></AvatarUI.Avatar>{state === "Group" && <AvatarUI.AvatarGroup><AvatarUI.Avatar><AvatarUI.AvatarFallback>A</AvatarUI.AvatarFallback></AvatarUI.Avatar><AvatarUI.Avatar><AvatarUI.AvatarFallback>B</AvatarUI.AvatarFallback></AvatarUI.Avatar><AvatarUI.AvatarGroupCount>+3</AvatarUI.AvatarGroupCount></AvatarUI.AvatarGroup>}</DemoCanvas>
    case "badge":
      return <DemoCanvas>{(["default", "secondary", "outline", "destructive"] as const).map((variant) => <BadgeUI.Badge key={variant} variant={variant}>{state === "Basic" ? "Badge" : variant}</BadgeUI.Badge>)}</DemoCanvas>
    case "breadcrumb":
      return <BreadcrumbUI.Breadcrumb><BreadcrumbUI.BreadcrumbList><BreadcrumbUI.BreadcrumbItem><BreadcrumbUI.BreadcrumbLink href="#">Home</BreadcrumbUI.BreadcrumbLink></BreadcrumbUI.BreadcrumbItem><ChevronRightIcon className="size-3"/><BreadcrumbUI.BreadcrumbItem><BreadcrumbUI.BreadcrumbLink href="#">Components</BreadcrumbUI.BreadcrumbLink></BreadcrumbUI.BreadcrumbItem><ChevronRightIcon className="size-3"/><BreadcrumbUI.BreadcrumbItem><BreadcrumbUI.BreadcrumbPage>{state === "Collapsed" ? "… / Breadcrumb" : "Breadcrumb"}</BreadcrumbUI.BreadcrumbPage></BreadcrumbUI.BreadcrumbItem></BreadcrumbUI.BreadcrumbList></BreadcrumbUI.Breadcrumb>
    case "bubble":
      return <BubbleUI.BubbleGroup className="w-[34rem]"><BubbleUI.Bubble><BubbleUI.BubbleContent>Hello! How can I help?</BubbleUI.BubbleContent>{state === "WithReactions" && <BubbleUI.BubbleReactions><ButtonUI.Button size="xs" variant="ghost">Helpful</ButtonUI.Button></BubbleUI.BubbleReactions>}</BubbleUI.Bubble><BubbleUI.Bubble variant="tinted" className="ml-auto w-fit"><BubbleUI.BubbleContent>Show me the component states.</BubbleUI.BubbleContent></BubbleUI.Bubble></BubbleUI.BubbleGroup>
    case "button":
      return <DemoCanvas>{state === "Variants" ? (["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map((variant) => <ButtonUI.Button key={variant} variant={variant}>{variant}</ButtonUI.Button>) : state === "Loading" ? <ButtonUI.Button isDisabled><SpinnerUI.Spinner/>Loading</ButtonUI.Button> : <ButtonUI.Button isDisabled={state === "Disabled"}>Button</ButtonUI.Button>}</DemoCanvas>
    case "button-group":
      return <ButtonGroupUI.ButtonGroup><ButtonUI.Button variant="outline">Back</ButtonUI.Button>{state === "WithLabel" && <><ButtonGroupUI.ButtonGroupSeparator/><ButtonGroupUI.ButtonGroupText>Page 1</ButtonGroupUI.ButtonGroupText></>}<ButtonUI.Button variant="outline">Next</ButtonUI.Button></ButtonGroupUI.ButtonGroup>
    case "calendar":
      return state === "Range" ? <CalendarUI.RangeCalendar aria-label="Trip dates" defaultValue={{start: parseDate("2026-10-08"), end: parseDate("2026-10-14")}}/> : <CalendarUI.Calendar aria-label="Appointment date" defaultValue={parseDate("2026-10-08")}/>
    case "card":
      return <CardUI.Card className="w-[24rem]" size={state === "Compact" ? "sm" : "default"}><CardUI.CardHeader><CardUI.CardTitle>Project status</CardUI.CardTitle><CardUI.CardDescription>Updated a few seconds ago.</CardUI.CardDescription>{state === "WithAction" && <CardUI.CardAction><BadgeUI.Badge>Active</BadgeUI.Badge></CardUI.CardAction>}</CardUI.CardHeader><CardUI.CardContent><p>All catalog checks are passing.</p></CardUI.CardContent><CardUI.CardFooter><ButtonUI.Button className="w-full">View details</ButtonUI.Button></CardUI.CardFooter></CardUI.Card>
    case "carousel":
      return <CarouselUI.Carousel className="w-[24rem]"><CarouselUI.CarouselContent>{[1,2,3].map((n) => <CarouselUI.CarouselItem key={n} className={state === "Multiple" ? "basis-1/2" : undefined}><div className="flex h-40 items-center justify-center rounded-xl bg-muted text-3xl font-semibold">{n}</div></CarouselUI.CarouselItem>)}</CarouselUI.CarouselContent><CarouselUI.CarouselPrevious/><CarouselUI.CarouselNext/></CarouselUI.Carousel>
    case "chart":
      return <ChartUI.ChartContainer config={chartConfig} className="h-[220px] w-[34rem]"><BarChart data={[{month:"Jan",desktop:186},{month:"Feb",desktop:305},{month:"Mar",desktop:237}]}><CartesianGrid vertical={false}/><XAxis dataKey="month" tickLine={false} axisLine={false}/>{state === "WithTooltip" && <ChartUI.ChartTooltip content={<ChartUI.ChartTooltipContent/>}/>}<Bar dataKey="desktop" fill="var(--color-desktop)" radius={6}/></BarChart></ChartUI.ChartContainer>
    case "checkbox":
      return <DemoCanvas><CheckboxUI.Checkbox defaultSelected={state === "Checked"}>Checked</CheckboxUI.Checkbox><CheckboxUI.Checkbox isIndeterminate={state === "Indeterminate"}>Indeterminate</CheckboxUI.Checkbox><CheckboxUI.Checkbox isDisabled={state === "Disabled"}>Disabled</CheckboxUI.Checkbox></DemoCanvas>
    case "collapsible":
      return <CollapsibleUI.Collapsible defaultExpanded={state === "Expanded"} className="w-[24rem]"><CollapsibleUI.CollapsibleTrigger><ButtonUI.Button variant="outline" className="w-full">Toggle details</ButtonUI.Button></CollapsibleUI.CollapsibleTrigger><CollapsibleUI.CollapsibleContent className="mt-2 rounded-lg border p-3 text-sm">Expanded disclosure content.</CollapsibleUI.CollapsibleContent></CollapsibleUI.Collapsible>
    case "combobox":
      return <ComboboxUI.Combobox aria-label="Framework" isDisabled={state === "Disabled"}><ComboboxUI.ComboboxInput placeholder={state === "Disabled" ? "Disabled" : "Select framework"}/><ComboboxUI.ComboboxContent><ComboboxUI.ComboboxList><ComboboxUI.ComboboxItem id="react">React</ComboboxUI.ComboboxItem><ComboboxUI.ComboboxItem id="vue">Vue</ComboboxUI.ComboboxItem><ComboboxUI.ComboboxItem id="angular">Angular</ComboboxUI.ComboboxItem></ComboboxUI.ComboboxList></ComboboxUI.ComboboxContent></ComboboxUI.Combobox>
    case "command":
      return <CommandUI.Command className="w-[30rem] rounded-xl border"><CommandUI.CommandInput placeholder="Type a command or search..."/><CommandUI.CommandList><CommandUI.CommandEmpty>No results found.</CommandUI.CommandEmpty><CommandUI.CommandGroup heading="Suggestions"><CommandUI.CommandItem><CalendarIcon/>Calendar<CommandUI.CommandShortcut>⌘K</CommandUI.CommandShortcut></CommandUI.CommandItem><CommandUI.CommandItem><SettingsIcon/>Settings</CommandUI.CommandItem><CommandUI.CommandItem isDisabled={state === "DisabledItem"}><UserIcon/>Account</CommandUI.CommandItem></CommandUI.CommandGroup></CommandUI.CommandList></CommandUI.Command>
    case "context-menu":
      return <ContextMenuUI.ContextMenuTrigger><div className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">Right click here</div><ContextMenuUI.ContextMenu><ContextMenuUI.ContextMenuLabel>Actions</ContextMenuUI.ContextMenuLabel><ContextMenuUI.ContextMenuItem>Back<ContextMenuUI.ContextMenuShortcut>⌘[</ContextMenuUI.ContextMenuShortcut></ContextMenuUI.ContextMenuItem><ContextMenuUI.ContextMenuItem isDisabled={state === "DisabledItem"}>Forward</ContextMenuUI.ContextMenuItem><ContextMenuUI.ContextMenuSeparator/><ContextMenuUI.ContextMenuItem variant="destructive">Delete</ContextMenuUI.ContextMenuItem></ContextMenuUI.ContextMenu></ContextMenuUI.ContextMenuTrigger>
    case "data-table":
      return <div className="grid w-[42rem] gap-3">{state === "Filtered" && <InputUI.Input placeholder="Filter emails..." defaultValue="example"/>}<TableUI.Table><TableUI.TableHeader><TableUI.TableRow><TableUI.TableHead>Status</TableUI.TableHead><TableUI.TableHead>Email</TableUI.TableHead><TableUI.TableHead className="text-right">Amount</TableUI.TableHead></TableUI.TableRow></TableUI.TableHeader><TableUI.TableBody>{payments.map(([status,email,amount]) => <TableUI.TableRow key={email}><TableUI.TableCell><BadgeUI.Badge variant={status === "failed" ? "destructive" : "secondary"}>{status}</BadgeUI.Badge></TableUI.TableCell><TableUI.TableCell>{email}</TableUI.TableCell><TableUI.TableCell className="text-right">{amount}</TableUI.TableCell></TableUI.TableRow>)}</TableUI.TableBody></TableUI.Table><div className="flex justify-end gap-2"><ButtonUI.Button size="sm" variant="outline" isDisabled>Previous</ButtonUI.Button><ButtonUI.Button size="sm" variant="outline">Next</ButtonUI.Button></div></div>
    case "date-picker":
      return <PopoverUI.PopoverTrigger><ButtonUI.Button variant="outline"><CalendarIcon/>{state === "Empty" ? "Pick a date" : "October 8, 2026"}</ButtonUI.Button><PopoverUI.Popover className="w-auto p-0"><CalendarUI.Calendar aria-label="Pick a date" defaultValue={state === "Empty" ? undefined : parseDate("2026-10-08")}/></PopoverUI.Popover></PopoverUI.PopoverTrigger>
    case "dialog":
      return <DialogUI.DialogTrigger><ButtonUI.Button variant="outline">Edit profile</ButtonUI.Button><DialogUI.Dialog><DialogUI.DialogHeader><DialogUI.DialogTitle>Edit profile</DialogUI.DialogTitle><DialogUI.DialogDescription>Make changes to your public profile.</DialogUI.DialogDescription></DialogUI.DialogHeader><FieldUI.Field><FieldUI.FieldLabel>Name</FieldUI.FieldLabel><InputUI.Input defaultValue="Eric" disabled={state === "DisabledForm"}/></FieldUI.Field><DialogUI.DialogFooter><DialogUI.DialogClose>Cancel</DialogUI.DialogClose><ButtonUI.Button slot="close">Save changes</ButtonUI.Button></DialogUI.DialogFooter></DialogUI.Dialog></DialogUI.DialogTrigger>
    case "direction":
      return <DirectionUI.DirectionProvider direction={state === "RTL" ? "rtl" : "ltr"}><ButtonUI.Button variant="outline">{state} <ChevronRightIcon/></ButtonUI.Button></DirectionUI.DirectionProvider>
    case "drawer":
      return <DrawerUI.DrawerTrigger><ButtonUI.Button variant="outline">Open drawer</ButtonUI.Button><DrawerUI.Drawer><DrawerUI.DrawerContent><DrawerUI.DrawerHeader><DrawerUI.DrawerTitle>Move goal</DrawerUI.DrawerTitle><DrawerUI.DrawerDescription>Choose a destination for this item.</DrawerUI.DrawerDescription></DrawerUI.DrawerHeader><DrawerUI.DrawerFooter><ButtonUI.Button slot="close">Move</ButtonUI.Button><DrawerUI.DrawerClose>Cancel</DrawerUI.DrawerClose></DrawerUI.DrawerFooter></DrawerUI.DrawerContent></DrawerUI.Drawer></DrawerUI.DrawerTrigger>
    case "dropdown-menu":
      return <DropdownMenuUI.DropdownMenuTrigger><ButtonUI.Button variant="outline">Open menu</ButtonUI.Button><DropdownMenuUI.DropdownMenu><DropdownMenuUI.DropdownMenuLabel>My account</DropdownMenuUI.DropdownMenuLabel><DropdownMenuUI.DropdownMenuSeparator/><DropdownMenuUI.DropdownMenuItem>Profile<DropdownMenuUI.DropdownMenuShortcut>⇧⌘P</DropdownMenuUI.DropdownMenuShortcut></DropdownMenuUI.DropdownMenuItem><DropdownMenuUI.DropdownMenuItem isDisabled={state === "DisabledItem"}>Settings</DropdownMenuUI.DropdownMenuItem><DropdownMenuUI.DropdownMenuItem variant="destructive">Log out</DropdownMenuUI.DropdownMenuItem></DropdownMenuUI.DropdownMenu></DropdownMenuUI.DropdownMenuTrigger>
    case "empty":
      return <EmptyUI.Empty className="w-[34rem] border"><EmptyUI.EmptyHeader><EmptyUI.EmptyMedia variant={state === "Icon" ? "icon" : "default"}><InboxIcon/></EmptyUI.EmptyMedia><EmptyUI.EmptyTitle>No messages</EmptyUI.EmptyTitle><EmptyUI.EmptyDescription>When a new message arrives, it will appear here.</EmptyUI.EmptyDescription></EmptyUI.EmptyHeader>{state === "WithAction" && <EmptyUI.EmptyContent><ButtonUI.Button><PlusIcon/>New message</ButtonUI.Button></EmptyUI.EmptyContent>}</EmptyUI.Empty>
    case "field":
      return <FieldUI.FieldSet className="w-[30rem]"><FieldUI.FieldLegend>Contact details</FieldUI.FieldLegend><FieldUI.FieldGroup><FieldUI.Field data-invalid={state === "Invalid" || undefined}><FieldUI.FieldLabel>Email</FieldUI.FieldLabel><InputUI.Input type="email" aria-invalid={state === "Invalid" || undefined} defaultValue={state === "Invalid" ? "not-an-email" : undefined} placeholder="name@example.com"/><FieldUI.FieldDescription>We will never share your email.</FieldUI.FieldDescription>{state === "Invalid" && <FieldUI.FieldError>Enter a valid email address.</FieldUI.FieldError>}</FieldUI.Field></FieldUI.FieldGroup></FieldUI.FieldSet>
    case "hover-card":
      return <HoverCardUI.HoverCardTrigger><ButtonUI.Button variant="link">@shadcn</ButtonUI.Button><HoverCardUI.HoverCard className="w-72"><div className="flex gap-3"><AvatarUI.Avatar><AvatarUI.AvatarFallback>SC</AvatarUI.AvatarFallback></AvatarUI.Avatar><div><div className="font-medium">shadcn</div><p className="text-sm text-muted-foreground">Beautifully designed components you can copy and own.</p></div></div></HoverCardUI.HoverCard></HoverCardUI.HoverCardTrigger>
    case "input":
      return <div className="grid w-[24rem] gap-3"><InputUI.Input placeholder="Default input"/><InputUI.Input aria-invalid={state === "Invalid" || undefined} defaultValue={state === "Invalid" ? "Invalid value" : "Filled value"}/><InputUI.Input disabled={state === "Disabled"} placeholder="Disabled input"/></div>
    case "input-group":
      return <InputGroupUI.InputGroup className="w-[28rem]"><InputGroupUI.InputGroupAddon><SearchIcon/><InputGroupUI.InputGroupText>Search</InputGroupUI.InputGroupText></InputGroupUI.InputGroupAddon><InputGroupUI.InputGroupInput aria-invalid={state === "Invalid" || undefined} placeholder="Components..."/><InputGroupUI.InputGroupAddon align="inline-end"><InputGroupUI.InputGroupButton aria-label="Submit" size="icon-xs"><ChevronRightIcon/></InputGroupUI.InputGroupButton></InputGroupUI.InputGroupAddon></InputGroupUI.InputGroup>
    case "input-otp":
      return <InputOtpUI.InputOTP maxLength={6} disabled={state === "Disabled"}><InputOtpUI.InputOTPGroup>{[0,1,2].map((i) => <InputOtpUI.InputOTPSlot key={i} index={i}/>)}</InputOtpUI.InputOTPGroup><InputOtpUI.InputOTPSeparator/><InputOtpUI.InputOTPGroup>{[3,4,5].map((i) => <InputOtpUI.InputOTPSlot key={i} index={i}/>)}</InputOtpUI.InputOTPGroup></InputOtpUI.InputOTP>
    case "item":
      return <ItemUI.ItemGroup className="w-[34rem]"><ItemUI.Item variant={state === "Outline" ? "outline" : "default"} isDisabled={state === "Disabled"}><ItemUI.ItemMedia variant="icon"><UserIcon/></ItemUI.ItemMedia><ItemUI.ItemContent><ItemUI.ItemTitle>Account settings</ItemUI.ItemTitle><ItemUI.ItemDescription>Manage your profile and preferences.</ItemUI.ItemDescription></ItemUI.ItemContent><ItemUI.ItemActions><ButtonUI.Button size="sm" variant="outline">Open</ButtonUI.Button></ItemUI.ItemActions></ItemUI.Item></ItemUI.ItemGroup>
    case "kbd":
      return <DemoCanvas><KbdUI.Kbd>⌘ K</KbdUI.Kbd>{state === "Group" && <KbdUI.KbdGroup><KbdUI.Kbd>Ctrl</KbdUI.Kbd><span>+</span><KbdUI.Kbd>Shift</KbdUI.Kbd><span>+</span><KbdUI.Kbd>P</KbdUI.Kbd></KbdUI.KbdGroup>}</DemoCanvas>
    case "label":
      return <div className="grid w-[24rem] gap-2"><LabelUI.Label htmlFor="catalog-email">{state === "Required" ? "Email address *" : "Email address"}</LabelUI.Label><InputUI.Input id="catalog-email" type="email" placeholder="name@example.com"/></div>
    case "marker":
      return <DemoCanvas><MarkerUI.Marker variant={state === "Bordered" ? "border" : "default"}><MarkerUI.MarkerIcon>{state === "Error" ? <CircleAlertIcon/> : <CheckIcon/>}</MarkerUI.MarkerIcon><MarkerUI.MarkerContent>{state === "Error" ? "Needs attention" : "Completed"}</MarkerUI.MarkerContent></MarkerUI.Marker></DemoCanvas>
    case "menubar":
      return <div className="flex rounded-md border bg-background p-1"><MenuTrigger><AriaButton className="rounded px-3 py-1.5 text-sm hover:bg-muted">File</AriaButton><AriaPopover className="rounded-md border bg-popover p-1 shadow-md"><Menu className="min-w-44 outline-none"><MenuItem className="rounded px-2 py-1.5 text-sm outline-none focus:bg-accent">New tab <span className="float-right text-muted-foreground">⌘T</span></MenuItem><MenuItem isDisabled={state === "DisabledItem"} className="rounded px-2 py-1.5 text-sm outline-none focus:bg-accent disabled:opacity-50">New window</MenuItem></Menu></AriaPopover></MenuTrigger><MenuTrigger><AriaButton className="rounded px-3 py-1.5 text-sm hover:bg-muted">Edit</AriaButton><AriaPopover className="rounded-md border bg-popover p-1 shadow-md"><Menu className="min-w-44 outline-none"><MenuItem className="rounded px-2 py-1.5 text-sm outline-none focus:bg-accent">Undo</MenuItem><MenuItem className="rounded px-2 py-1.5 text-sm outline-none focus:bg-accent">Redo</MenuItem></Menu></AriaPopover></MenuTrigger></div>
    case "message":
      return <MessageUI.MessageGroup className="w-[34rem]"><MessageUI.Message><MessageUI.MessageAvatar>AI</MessageUI.MessageAvatar><MessageUI.MessageContent><MessageUI.MessageHeader>Assistant</MessageUI.MessageHeader><div className="rounded-xl bg-muted p-3">Here is the complete component catalog.</div><MessageUI.MessageFooter>Just now</MessageUI.MessageFooter></MessageUI.MessageContent></MessageUI.Message>{state === "Conversation" && <MessageUI.Message align="end"><MessageUI.MessageContent><div className="rounded-xl bg-primary p-3 text-primary-foreground">Looks good—show disabled states too.</div><MessageUI.MessageFooter>Delivered</MessageUI.MessageFooter></MessageUI.MessageContent></MessageUI.Message>}</MessageUI.MessageGroup>
    case "message-scroller":
      return <MessageScrollerUI.MessageScrollerProvider><MessageScrollerUI.MessageScroller className="h-56 w-[34rem] rounded-xl border"><MessageScrollerUI.MessageScrollerViewport><MessageScrollerUI.MessageScrollerContent>{Array.from({length: state === "Long" ? 16 : 6}, (_, i) => <MessageScrollerUI.MessageScrollerItem key={i}><div className="m-3 rounded-lg bg-muted p-3 text-sm">Message {i + 1}</div></MessageScrollerUI.MessageScrollerItem>)}</MessageScrollerUI.MessageScrollerContent></MessageScrollerUI.MessageScrollerViewport></MessageScrollerUI.MessageScroller></MessageScrollerUI.MessageScrollerProvider>
    case "native-select":
      return <NativeSelectUI.NativeSelect defaultValue="react" aria-label="Framework" disabled={state === "Disabled"}><NativeSelectUI.NativeSelectOption value="react">React</NativeSelectUI.NativeSelectOption><NativeSelectUI.NativeSelectOption value="vue">Vue</NativeSelectUI.NativeSelectOption><NativeSelectUI.NativeSelectOption value="angular">Angular</NativeSelectUI.NativeSelectOption></NativeSelectUI.NativeSelect>
    case "navigation-menu":
      return <nav aria-label="Main navigation" className="rounded-lg border bg-background p-2"><ul className="flex items-center gap-1"><li><a className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" href="#">Home</a></li><li><a className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent" href="#">Components</a></li><li><a aria-disabled={state === "DisabledLink"} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent aria-disabled:pointer-events-none aria-disabled:opacity-50" href="#">Documentation</a></li></ul></nav>
    case "pagination":
      return <PaginationUI.Pagination><PaginationUI.PaginationContent><PaginationUI.PaginationItem><PaginationUI.PaginationPrevious href="#"/></PaginationUI.PaginationItem>{[1,2,3].map((n) => <PaginationUI.PaginationItem key={n}><PaginationUI.PaginationLink href="#" isActive={n === (state === "ThirdPage" ? 3 : 2)}>{n}</PaginationUI.PaginationLink></PaginationUI.PaginationItem>)}<PaginationUI.PaginationItem><PaginationUI.PaginationEllipsis/></PaginationUI.PaginationItem><PaginationUI.PaginationItem><PaginationUI.PaginationNext href="#"/></PaginationUI.PaginationItem></PaginationUI.PaginationContent></PaginationUI.Pagination>
    case "popover":
      return <PopoverUI.PopoverTrigger><ButtonUI.Button variant="outline">Open popover</ButtonUI.Button><PopoverUI.Popover className="w-72"><PopoverUI.PopoverHeader><PopoverUI.PopoverTitle>Dimensions</PopoverUI.PopoverTitle><PopoverUI.PopoverDescription>Set the dimensions for the layer.</PopoverUI.PopoverDescription></PopoverUI.PopoverHeader><div className="grid gap-2"><InputUI.Input defaultValue="100%"/><InputUI.Input defaultValue={state === "Custom" ? "480px" : "300px"}/></div></PopoverUI.Popover></PopoverUI.PopoverTrigger>
    case "progress":
      return <div className="grid w-[30rem] gap-5"><ProgressUI.Progress value={state === "Indeterminate" ? undefined : 66} isIndeterminate={state === "Indeterminate"}><ProgressUI.ProgressLabel>{state === "Indeterminate" ? "Processing" : "Uploading"}</ProgressUI.ProgressLabel><ProgressUI.ProgressValue/></ProgressUI.Progress></div>
    case "questionnaire": {
      const items = [{name:"framework",required:true,choices:[{value:"react"},{value:"vue"},{value:"angular"}]}]
      return <QuestionnaireUI.Questionnaire className="w-[32rem]" items={items} defaultItem="framework"><QuestionnaireUI.QuestionnaireProgress render={(props) => <div {...props}>Question 1 of 1</div>}/><QuestionnaireUI.QuestionnaireItem name="framework" required><QuestionnaireUI.QuestionnaireTitle>Which framework do you use?</QuestionnaireUI.QuestionnaireTitle><QuestionnaireUI.QuestionnaireDescription>Select one answer.</QuestionnaireUI.QuestionnaireDescription><QuestionnaireUI.QuestionnaireChoices><QuestionnaireUI.QuestionnaireChoice value="react">React</QuestionnaireUI.QuestionnaireChoice><QuestionnaireUI.QuestionnaireChoice value="vue">Vue</QuestionnaireUI.QuestionnaireChoice><QuestionnaireUI.QuestionnaireChoice value="angular">Angular</QuestionnaireUI.QuestionnaireChoice></QuestionnaireUI.QuestionnaireChoices><QuestionnaireUI.QuestionnaireActions>{state === "Skippable" && <QuestionnaireUI.QuestionnaireSkip>Skip</QuestionnaireUI.QuestionnaireSkip>}<QuestionnaireUI.QuestionnaireNext>Next</QuestionnaireUI.QuestionnaireNext></QuestionnaireUI.QuestionnaireActions></QuestionnaireUI.QuestionnaireItem></QuestionnaireUI.Questionnaire>
    }
    case "radio-group":
      return <RadioGroupUI.RadioGroup defaultValue="comfortable" aria-label="Density" className="grid gap-2"><RadioGroupUI.RadioGroupItem value="default">Default</RadioGroupUI.RadioGroupItem><RadioGroupUI.RadioGroupItem value="comfortable">Comfortable</RadioGroupUI.RadioGroupItem><RadioGroupUI.RadioGroupItem value="compact">Compact</RadioGroupUI.RadioGroupItem><RadioGroupUI.RadioGroupItem value="disabled" isDisabled={state === "DisabledItem"}>Disabled</RadioGroupUI.RadioGroupItem></RadioGroupUI.RadioGroup>
    case "resizable":
      return <ResizableUI.ResizablePanelGroup orientation={state === "Vertical" ? "vertical" : "horizontal"} className="h-52 w-[36rem] rounded-xl border"><ResizableUI.ResizablePanel defaultSize={50}><div className="flex size-full items-center justify-center">One</div></ResizableUI.ResizablePanel><ResizableUI.ResizableHandle withHandle/><ResizableUI.ResizablePanel defaultSize={50}><div className="flex size-full items-center justify-center">Two</div></ResizableUI.ResizablePanel></ResizableUI.ResizablePanelGroup>
    case "scroll-area":
      return <ScrollAreaUI.ScrollArea className={state === "Horizontal" ? "w-80 whitespace-nowrap rounded-xl border p-4" : "h-56 w-[24rem] rounded-xl border p-4"}>{Array.from({length:24},(_,i)=><span className={state === "Horizontal" ? "mr-6 inline-block" : "block border-b py-2 text-sm"} key={i}>Component {i+1}</span>)}</ScrollAreaUI.ScrollArea>
    case "select":
      return <SelectUI.Select defaultSelectedKey="react" aria-label="Framework" isDisabled={state === "Disabled"}><SelectUI.SelectTrigger><SelectUI.SelectValue/></SelectUI.SelectTrigger><SelectUI.SelectContent><SelectUI.SelectItem id="react">React</SelectUI.SelectItem><SelectUI.SelectItem id="vue">Vue</SelectUI.SelectItem><SelectUI.SelectItem id="angular">Angular</SelectUI.SelectItem></SelectUI.SelectContent></SelectUI.Select>
    case "separator":
      return state === "Vertical" ? <div className="flex h-5 items-center gap-4 text-sm"><span>Docs</span><SeparatorUI.Separator orientation="vertical"/><span>Components</span><SeparatorUI.Separator orientation="vertical"/><span>Examples</span></div> : <div className="w-[28rem]"><h4 className="font-medium">shadcn/ui</h4><SeparatorUI.Separator className="my-4"/><p className="text-sm text-muted-foreground">Accessible component catalog</p></div>
    case "sheet":
      return <SheetUI.SheetTrigger><ButtonUI.Button variant="outline">Open sheet</ButtonUI.Button><SheetUI.Sheet><SheetUI.SheetContent side={state === "Left" ? "left" : "right"}><SheetUI.SheetHeader><SheetUI.SheetTitle>Catalog settings</SheetUI.SheetTitle><SheetUI.SheetDescription>Configure how component stories are displayed.</SheetUI.SheetDescription></SheetUI.SheetHeader><div className="grid gap-3 p-4"><LabelUI.Label>Display name</LabelUI.Label><InputUI.Input defaultValue="Shadcn"/></div><SheetUI.SheetFooter><ButtonUI.Button slot="close">Save</ButtonUI.Button><SheetUI.SheetClose>Cancel</SheetUI.SheetClose></SheetUI.SheetFooter></SheetUI.SheetContent></SheetUI.Sheet></SheetUI.SheetTrigger>
    case "sidebar":
      return <SidebarUI.SidebarProvider defaultOpen className="h-[28rem] min-h-0 w-[48rem]"><SidebarUI.Sidebar><SidebarUI.SidebarHeader><div className="px-2 py-1 font-semibold">Catalog</div></SidebarUI.SidebarHeader><SidebarUI.SidebarContent><SidebarUI.SidebarGroup><SidebarUI.SidebarGroupLabel>Components</SidebarUI.SidebarGroupLabel><SidebarUI.SidebarGroupContent><SidebarUI.SidebarMenu>{["Accordion","Button","Calendar"].map((name)=><SidebarUI.SidebarMenuItem key={name}><SidebarUI.SidebarMenuButton isActive={name === (state === "AccordionActive" ? "Accordion" : "Button")}>{name}</SidebarUI.SidebarMenuButton></SidebarUI.SidebarMenuItem>)}</SidebarUI.SidebarMenu></SidebarUI.SidebarGroupContent></SidebarUI.SidebarGroup></SidebarUI.SidebarContent><SidebarUI.SidebarFooter><SidebarUI.SidebarMenu><SidebarUI.SidebarMenuItem><SidebarUI.SidebarMenuButton><SettingsIcon/>Settings</SidebarUI.SidebarMenuButton></SidebarUI.SidebarMenuItem></SidebarUI.SidebarMenu></SidebarUI.SidebarFooter></SidebarUI.Sidebar><SidebarUI.SidebarInset><header className="flex h-12 items-center gap-2 border-b px-4"><SidebarUI.SidebarTrigger/>Preview</header></SidebarUI.SidebarInset></SidebarUI.SidebarProvider>
    case "skeleton":
      return <div className="flex w-[24rem] items-center gap-4">{state === "Card" ? <SkeletonUI.Skeleton className="h-40 w-full rounded-xl"/> : <><SkeletonUI.Skeleton className="size-12 rounded-full"/><div className="flex-1 space-y-2"><SkeletonUI.Skeleton className="h-4 w-3/4"/><SkeletonUI.Skeleton className="h-4 w-1/2"/></div></>}</div>
    case "slider":
      return <div className="grid w-[30rem] gap-6"><SliderUI.Slider defaultValue={state === "Range" ? [25,75] : 40} isDisabled={state === "Disabled"} aria-label="Volume"/></div>
    case "spinner":
      return <DemoCanvas><SpinnerUI.Spinner className={state === "Large" ? "size-8" : undefined}/>{state === "InButton" && <ButtonUI.Button isDisabled><SpinnerUI.Spinner/>Saving</ButtonUI.Button>}</DemoCanvas>
    case "switch":
      return <div className="grid gap-3"><SwitchUI.Switch defaultSelected={state === "Selected"} isDisabled={state === "Disabled"} isReadOnly={state === "ReadOnly"}>Notifications</SwitchUI.Switch></div>
    case "table":
      return <div className="w-[38rem] rounded-xl border"><TableUI.Table><TableUI.TableCaption>Recent component checks</TableUI.TableCaption><TableUI.TableHeader><TableUI.TableRow><TableUI.TableHead>Component</TableUI.TableHead><TableUI.TableHead>Status</TableUI.TableHead><TableUI.TableHead className="text-right">Stories</TableUI.TableHead></TableUI.TableRow></TableUI.TableHeader><TableUI.TableBody>{[["Accordion","Ready","7"],["Button","Ready","4"],["Select",state === "Striped" ? "Review" : "Ready","3"]].map(([name,status,count])=><TableUI.TableRow key={name}><TableUI.TableCell className="font-medium">{name}</TableUI.TableCell><TableUI.TableCell>{status}</TableUI.TableCell><TableUI.TableCell className="text-right">{count}</TableUI.TableCell></TableUI.TableRow>)}</TableUI.TableBody></TableUI.Table></div>
    case "tabs":
      return <TabsUI.Tabs defaultSelectedKey="account" className="w-[30rem]"><TabsUI.TabsList variant={state === "Line" ? "line" : "default"}><TabsUI.TabsTrigger id="account">Account</TabsUI.TabsTrigger><TabsUI.TabsTrigger id="password">Password</TabsUI.TabsTrigger><TabsUI.TabsTrigger id="disabled" isDisabled>Disabled</TabsUI.TabsTrigger></TabsUI.TabsList><TabsUI.TabsContent id="account" className="rounded-lg border p-4">Manage account settings.</TabsUI.TabsContent><TabsUI.TabsContent id="password" className="rounded-lg border p-4">Change your password.</TabsUI.TabsContent><TabsUI.TabsContent id="disabled"/></TabsUI.Tabs>
    case "textarea":
      return <TextareaUI.Textarea className="w-[28rem]" placeholder="Write a message..." aria-invalid={state === "Invalid" || undefined} disabled={state === "Disabled"} defaultValue={state === "Filled" ? "Existing content" : undefined}/>
    case "toast":
      return <DemoCanvas><SonnerUI.Toaster/><ButtonUI.Button onPress={() => state === "Error" ? toast.error("Unable to save") : state === "Loading" ? toast.loading("Saving changes") : toast.success("Catalog saved")}>{state} toast</ButtonUI.Button></DemoCanvas>
    case "toggle":
      return <DemoCanvas><ToggleUI.Toggle defaultSelected={state === "Pressed"} variant={state === "Outline" ? "outline" : "default"} isDisabled={state === "Disabled"}>{state}</ToggleUI.Toggle></DemoCanvas>
    case "toggle-group":
      return <ToggleGroupUI.ToggleGroup selectionMode={state === "Multiple" ? "multiple" : "single"} defaultSelectedKeys={state === "Multiple" ? ["bold","italic"] : ["center"]} aria-label="Formatting"><ToggleGroupUI.ToggleGroupItem id="left">Left</ToggleGroupUI.ToggleGroupItem><ToggleGroupUI.ToggleGroupItem id="center">Center</ToggleGroupUI.ToggleGroupItem><ToggleGroupUI.ToggleGroupItem id="right">Right</ToggleGroupUI.ToggleGroupItem><ToggleGroupUI.ToggleGroupItem id="bold">Bold</ToggleGroupUI.ToggleGroupItem><ToggleGroupUI.ToggleGroupItem id="italic">Italic</ToggleGroupUI.ToggleGroupItem></ToggleGroupUI.ToggleGroup>
    case "tooltip":
      return <TooltipUI.TooltipTrigger delay={state === "Delayed" ? 700 : 0}><ButtonUI.Button variant="outline" size="icon" aria-label="Notifications"><BellIcon/></ButtonUI.Button><TooltipUI.Tooltip>{state === "Delayed" ? "Shown after a delay" : "Notifications"}</TooltipUI.Tooltip></TooltipUI.TooltipTrigger>
    case "typography":
      return state === "Article" ? <article className="max-w-2xl space-y-4"><h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">The Joke Tax Chronicles</h1><p className="leading-7">Once upon a time, in a far-off land, there was a very lazy king.</p><blockquote className="mt-6 border-l-2 pl-6 italic">After all, he said, everyone enjoys a good joke.</blockquote></article> : <div className="grid gap-3"><h1 className="text-4xl font-bold">Heading 1</h1><h2 className="text-3xl font-semibold">Heading 2</h2><p className="leading-7">A paragraph demonstrating the shared typographic scale.</p><small className="text-sm text-muted-foreground">Muted supporting text</small></div>
    default:
      return <AlertUI.Alert><InfoIcon/><AlertUI.AlertTitle>{component}</AlertUI.AlertTitle><AlertUI.AlertDescription>{state} state</AlertUI.AlertDescription></AlertUI.Alert>
  }
}
