import { Button } from "@/components/ui/Button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="w-full p-4">
      <div className="my-8 text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-muted-foreground">
          Sign up in seconds and start being productive.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <InputGroup className="bg-accent/50 h-11 px-2">
            <InputGroupInput type="email" placeholder="Enter your email" />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>

          <InputGroup className="bg-accent/50 h-11 px-2">
            <InputGroupInput type="password" placeholder="Password" />
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="cursor-pointer">
              <EyeOffIcon />
            </InputGroupAddon>
          </InputGroup>

          <InputGroup className="bg-accent/50 h-11 px-2">
            <InputGroupInput type="password" placeholder="Confirm Password" />
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="cursor-pointer">
              <EyeOffIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <Button className="h-11 w-full text-base">Sign Up</Button>

          <div className="flex w-full items-center gap-2">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-neutral-300 dark:via-neutral-700" />
            or
            <div className="h-[1px] w-full bg-gradient-to-r from-neutral-300 to-transparent dark:via-neutral-700" />
          </div>

          <div className="flex w-full gap-2">
            <Button className="h-11 flex-1 text-base">Github</Button>
            <Button className="h-11 flex-1 text-base">Google</Button>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-1">
          <p>Already have an account?</p>
          <Link href={"/sign-in"} className="text-primary font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
