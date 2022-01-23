export class JitsiAccess {
	public constructor(
		public readonly alias: string,
		public readonly roomName: string,
		public readonly jwt: string,
		public readonly isCreator: boolean,
	) {}
}
