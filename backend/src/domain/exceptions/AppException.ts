export abstract class AppException {
	public readonly identifier: string

	protected constructor(
		public readonly statusCode: number,
		public readonly message: string,
		public readonly payload?: object,
		identifier?: string,
	) {
		this.identifier = identifier ?? this.constructor.name
	}
}
