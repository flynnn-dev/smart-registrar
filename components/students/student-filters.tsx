import { SEARCH_FORM_CLASS } from "@/components/shared/search-form";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staffStudentsHref, type StaffStudentFilters } from "@/lib/registrar/student-filters";
import { cn } from "@/lib/utils";

type StudentFiltersProps = {
  filters: StaffStudentFilters;
};

export function StudentFilters({ filters }: StudentFiltersProps) {
  return (
    <form
      action="/registrar/students"
      method="get"
      className={SEARCH_FORM_CLASS}
    >
      <div className="space-y-1.5">
        <Label htmlFor="student-search">Search</Label>
        <Input
          id="student-search"
          name="q"
          defaultValue={filters.q}
          placeholder="Name, student ID, email, or contact"
        />
      </div>
      <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>
        Search
      </button>
      {filters.q ? (
        <a
          href={staffStudentsHref({})}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Clear
        </a>
      ) : null}
    </form>
  );
}
