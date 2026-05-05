---
description: Auto-router to existing skills based on file patterns and task context
---

# Skill Router Workflow

This workflow automatically routes to the appropriate existing skill in `.agents/skills/` based on file patterns and task context, similar to how `.cursorrules` works.

## When to Use This Workflow

- This workflow is automatically triggered based on the files you're working on
- No manual invocation needed - it routes to the relevant skill automatically
- Use when you want to apply project-specific best practices

## Auto-Routing Logic

### Performance Skill (`/performance`)
**Triggered by:**
- `next.config.ts`, `src/lib/performance.ts`, `src/app/globals.css`
- Bundle optimization tasks
- Core Web Vitals issues (LCP, CLS, FID)
- Performance monitoring implementation
- Image/font optimization tasks

**Routes to:** `.agents/skills/performance/SKILL.md`

### UI Components Skill (`/ui-components`)
**Triggered by:**
- `src/components/**/*.tsx`
- UI component creation/modification
- React components in `src/app/`
- Interactive element implementation

**Routes to:** `.agents/skills/ui-components/SKILL.md`

### Animations Skill (`/animations`)
**Triggered by:**
- Framer Motion usage
- Animation-related code
- Game-specific animations
- UI transitions and micro-interactions

**Routes to:** `.agents/skills/animations/SKILL.md`

### Code Quality Skill (`/code-quality`)
**Triggered by:**
- Refactoring tasks
- TypeScript improvements
- Code review and linting
- Code standardization

**Routes to:** `.agents/skills/code-quality/SKILL.md`

### Testing Skill (`/testing`)
**Triggered by:**
- Test file creation (`**/__tests__/**/*.test.{ts,tsx}`)
- Testing tasks
- Test configuration
- Coverage improvements

**Routes to:** `.agents/skills/testing/SKILL.md`

### Security Skill (`/security`)
**Triggered by:**
- Security-related tasks
- Environment variables
- Authentication/authorization
- Data protection

**Routes to:** `.agents/skills/security/SKILL.md`

### i18n Skill (`/i18n`)
**Triggered by:**
- Translation-related tasks
- Internationalization implementation
- `messages/` directory work
- `next-intl` configuration

**Routes to:** `.agents/skills/i18n/SKILL.md`

### Supabase Skill (`/supabase`)
**Triggered by:**
- Database operations
- API endpoints (`/api/`)
- Supabase queries
- Edge Functions

**Routes to:** `.agents/skills/supabase/SKILL.md`

### Cost Optimization Skill (`/cost-optimization`)
**Triggered by:**
- Vercel optimization
- Bundle size reduction
- Cost-related improvements
- Resource optimization

**Routes to:** `.agents/skills/cost-optimization/SKILL.md`

## Usage Instructions

### Automatic Detection
The router automatically detects which skill to use based on:

1. **File Patterns**: The files you're currently editing
2. **Task Context**: The type of task you're working on
3. **Directory Structure**: Location of files in the project

### Manual Skill Invocation
If auto-detection doesn't work, you can manually invoke skills:

```
/performance        # For performance optimization tasks
/ui-components      # For UI component work
/animations         # For animation implementation
/code-quality       # For code refactoring and quality
/testing           # For testing tasks
/security          # For security implementation
/i18n              # For internationalization
/supabase          # For database operations
/cost-optimization # For cost optimization
```

## Skill Application Process

### 1. Context Analysis
// turbo
1. Analyze current file patterns and task context
2. Identify the most relevant skill based on triggers
3. Load the corresponding skill file from `.agents/skills/`

### 2. Skill Application
1. Read the skill guidelines from the identified skill file
2. Apply the specific patterns and best practices
3. Follow the step-by-step instructions in the skill

### 3. Validation
1. Ensure all skill requirements are met
2. Check against project-specific guidelines
3. Validate implementation quality

## Integration with Development Workflow

### IDE Integration
- Works seamlessly with your existing development workflow
- No additional setup required
- Automatically activates when relevant files are opened

### Context Awareness
- Understands project structure and conventions
- Applies DragonBallDle-specific patterns
- Maintains consistency with existing codebase

### Quality Assurance
- Ensures consistent application of best practices
- Reduces cognitive load when switching between domains
- Maintains high code quality standards

## Example Usage Scenarios

### Working on Performance
```bash
# When editing next.config.ts or performance files
# Automatically routes to performance skill
# Applies performance optimization guidelines
```

### Creating UI Components
```bash
# When creating components in src/components/
# Automatically routes to ui-components skill
# Applies Tailwind, accessibility, and i18n patterns
```

### Adding Animations
```bash
# When working with Framer Motion
# Automatically routes to animations skill
# Applies game-quality animation standards
```

## File Pattern Mapping

See `@[AGENTS.md]` for the complete skill router mapping and project rules.

| Pattern | Skill | Files |
|---------|-------|-------|
| `next.config.ts`, `**/performance.ts` | performance | Config and performance files |
| `src/components/**/*.tsx` | ui-components | UI components |
| `**/*.test.{ts,tsx}` | testing | Test files |
| `src/lib/supabase.ts`, `api/` | supabase | Database and API |
| `messages/`, `**/i18n/` | i18n | Translation files |
| `.env`, security configs | security | Security-related files |

**Note:** The authoritative skill router mapping is maintained in `@[AGENTS.md]` under "Skill Router — read before coding" section.

## Benefits

- **Automatic Routing**: No need to manually select skills
- **Context-Aware**: Understands what you're working on
- **Consistent Quality**: Ensures best practices are applied
- **Efficiency**: Reduces cognitive load and speeds up development
- **Project-Specific**: Tailored to DragonBallDle's architecture and patterns
