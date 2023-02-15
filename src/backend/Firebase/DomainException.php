class DomainException extends LogicException {
	/* Inherited properties */
	protected string $message = "";
	private string $string = "";
	protected int $code;
	protected string $file = "";
	protected int $line;
	private array $trace = [];
	private ?Throwable $previous = null;
	/* Inherited methods */
	final public Exception::getMessage(): string
	final public Exception::getPrevious(): ?Throwable
	final public Exception::getCode(): int
	final public Exception::getFile(): string
	final public Exception::getLine(): int
	final public Exception::getTrace(): array
	final public Exception::getTraceAsString(): string
	public Exception::__toString(): string
	private Exception::__clone(): void
}