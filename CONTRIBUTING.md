# Contributing to Recomp

Thanks for helping improve Recomp. Bug reports, documentation improvements, accessibility fixes, and well-scoped code changes are welcome.

## Report an issue

Open an issue at https://github.com/rajjitlai/Recomp/issues with:

- A clear description of the expected and actual behavior.
- Reproduction steps, platform, device/browser, and app version.
- Relevant error messages or screenshots with personal information removed.

For a substantial feature or training-program change, discuss the approach in an issue before implementing it. Do not include credentials, private exercise notes, or personal health data in public reports.

## Development workflow

1. Fork the repository and clone your fork.
2. Create a focused branch, such as `fix/workout-progress`.
3. Follow the prerequisites in [README.md](./README.md), then run `npm ci`.
4. Make the change and add meaningful tests for changed program or persistence behavior.
5. Run the checks below and submit a pull request against the upstream default branch.

```sh
npm run typecheck
npm test
npm run export:web
```

For native-related changes, also run `npx expo export --platform all` and describe any device checks performed. A bundle export is not a device test.

## Project conventions

- Use strict TypeScript and reusable components.
- Keep exercise data in `src/data/` and business logic in `src/services/`.
- Keep plan generation deterministic and preserve saved workout history.
- Test migrations before changing storage formats or program identifiers.
- Update the image manifest when adding catalog entries and run `npm run images` when adding local assets.
- Follow the existing Prettier formatting. Format only the files you change.
- Keep dependency changes compatible with Expo SDK 55 and include lockfile updates.
- Do not commit generated bundles, `node_modules`, secrets, or signing credentials.

## Pull request checklist

- [ ] Explain the problem and resulting behavior.
- [ ] Include relevant validation results and screenshots for visual changes.
- [ ] Update documentation when setup or behavior changes.
- [ ] Confirm existing progress and history are preserved where applicable.
- [ ] Ensure contributed code and assets can be redistributed under their stated terms.

## Licensing

Unless explicitly agreed otherwise, contributions to this project's code are submitted under its [MIT License](./LICENSE). Third-party material must retain its own required notices. Only submit images you own or are authorized to redistribute, and document their source and license.
