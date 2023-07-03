import useSWR from "swr";
import { LoadingContent } from "@/components/LoadingContent";
import { Button } from "./Button";
import { ThreadResponse } from "@/app/api/google/threads/[id]/route";

type Item = { id: string; text: string };

export function List(props: {
  items: Item[];
  onArchive: (id: string) => void;
}) {
  const { items } = props;

  return (
    <ul role="list" className="divide-y divide-gray-800">
      {items.map((item) => (
        <ListItem key={item.id} item={item} onArchive={props.onArchive} />
      ))}
    </ul>
  );
}

function ListItem(props: { item: Item; onArchive: (id: string) => void }) {
  const { item, onArchive } = props;

  const { data, isLoading, error } = useSWR<ThreadResponse>(
    `/api/google/threads/${item.id}`
  );

  return (
    <li className="flex py-5">
      <div className="max-w-full">
        <p className="text-sm font-semibold leading-6 text-white break-words whitespace-pre-wrap">
          {item.text}
        </p>
        <LoadingContent loading={isLoading} error={error}>
          {data && (
            <p className="mt-1 truncate text-xs leading-5 text-gray-400 break-words whitespace-pre-wrap">
              {data.thread.messages?.[0]?.text.substring(0, 280) || "No message text"}
            </p>
          )}
        </LoadingContent>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-white">
          <Button onClick={() => onArchive(item.id)}>Archive</Button>
        </p>
      </div>
    </li>
  );
}