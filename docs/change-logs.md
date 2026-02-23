# Changelog Template

Use this template to create changelog files for each issue/feature.

## Naming Convention
Name files based on the issue or feature: `<issue-name>.md`
Examples:
- `loopnode-blocknode-fixes.md`
- `add-export-feature.md`
- `fix-validation-errors.md`

## Folder Organization
Changelogs are organized into date-based folders:
- Folder format: `YYYY-MM-DD`
- Examples: `2025-12-11/`, `2024-12-09/`
- Each changelog file is placed inside its corresponding date folder

> **Note for LLM:** When creating a changelog:
> 1. Ask the user for their name and email to fill in the Author field
> 2. Use the date specified in the changelog (or today's date if not specified)
> 3. Check if a folder named `YYYY-MM-DD` exists in the changelog directory
> 4. If the folder doesn't exist, create it
> 5. Create the changelog file inside that date folder
> 
> **Example:** For a changelog dated 2025-12-11, the full path would be:
> `changelog/2025-12-11/fix-validation-errors.md`

---

# [Issue/Feature Title]

**Date:** YYYY-MM-DD  
**Author:** [Name] ([email])

## Summary
Brief description of what was done.

## Changes

### Added
- New features or capabilities

### Changed
- Modifications to existing functionality

### Fixed
- Bug fixes

### Removed
- Removed features or code

## Files Modified
- List of modified files
