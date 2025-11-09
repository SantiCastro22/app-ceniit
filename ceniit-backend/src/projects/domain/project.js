// src/projects/domain/project.js

class Project {
  constructor({
    id,
    name,
    description,
    status,
    start_date,
    end_date,
    budget,
    leader,
    progress,
    created_by,
    created_at,
    // Optional fields from complex queries
    creator_name,
    resource_count,
    member_count,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.startDate = start_date;
    this.endDate = end_date;
    this.budget = budget;
    this.leader = leader;
    this.progress = progress;
    this.createdBy = created_by;
    this.createdAt = created_at;
    this.creatorName = creator_name;
    this.resourceCount = resource_count;
    this.memberCount = member_count;
  }
}

export default Project;
