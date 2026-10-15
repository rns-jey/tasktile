import { FilesIcon } from "lucide-react";
import { Button } from "../ui/Button";

export default function UnfinishedBanner() {
  return (
    <div className="bg-paper-3 flex items-center justify-between rounded-lg p-2">
      <div className="flex items-center gap-2">
        <FilesIcon />
        <p>3 unfinished from earlier</p>
      </div>

      <Button variant={"ghost"}>Sort them</Button>
    </div>
  );
}
