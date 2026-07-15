import type { Project } from "@/types/common";
import type { CompanyProject } from "@/lib/api/companyService";

/**
 * Map Django company project list/detail payload → UI `Project` shape.
 */
function isTeamProjectRow(p: CompanyProject): boolean {
    if (p.isTeamProject === true || p.is_team_project === true) return true;
    if (p.isTeamProject === false || p.is_team_project === false) return false;
    const tr = p.teamRoles;
    if (Array.isArray(tr) && tr.length > 0) return true;
    if (tr && typeof tr === "object" && !Array.isArray(tr) && Object.keys(tr as object).length > 0) return true;
    return false;
}

export function mapCompanyProjectToProject(p: CompanyProject): Project {
    let status: Project["status"] = "Draft";
    if (p.status === "published") status = "Active";
    else if (p.status === "draft") status = "Draft";
    else if (p.status === "closed") status = "Completed";

    const created = p.created_at ? new Date(p.created_at).getTime() : Date.now();
    const team = isTeamProjectRow(p);
    const rawRoles = p.teamRoles;
    const teamRoles =
        Array.isArray(rawRoles) && rawRoles.length
            ? (rawRoles as { role: string; count: number }[])
            : undefined;

    return {
        id: String(p.id),
        title: p.title,
        type: team ? "Team" : "Individual",
        status,
        applicants: p.applicants ?? 0,
        passed: p.passed ?? 0,
        daysLeft: p.daysLeft ?? p.days_left ?? 0,
        progress: p.progress ?? 0,
        link: `/company/projects/${p.id}`,
        createdAt: created,
        description: p.description,
        difficulty: p.difficulty_level ?? p.difficultyLevel,
        tags: p.required_skills ?? p.tags,
        teamRoles,
        starterTemplate: p.starterTemplate,
        baseRepo: p.baseRepo,
        passingScore: p.passingScore,
    };
}
